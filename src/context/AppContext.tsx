import React, { createContext, useContext, useState } from 'react';
import {
  YogaClass,
  Instructor,
  Booking,
  UserProfile,
  MembershipPlan,
  YogaCategory,
} from '../types';
import {
  INITIAL_CLASSES,
  INSTRUCTORS,
  INITIAL_BOOKINGS,
  CLIENT_USER,
  ADMIN_USER,
  MEMBERSHIP_PLANS,
} from '../data/mockData';

interface AppContextType {
  classes: YogaClass[];
  instructors: Instructor[];
  bookings: Booking[];
  user: UserProfile;
  selectedDate: string;
  selectedCategory: YogaCategory;
  selectedLevel: string;
  membershipPlans: MembershipPlan[];
  notificationToast: string | null;
  setSelectedDate: (date: string) => void;
  setSelectedCategory: (cat: YogaCategory) => void;
  setSelectedLevel: (lvl: string) => void;
  bookClass: (classId: string, useMembership: boolean) => { success: boolean; message: string };
  cancelBooking: (bookingId: string) => { success: boolean; message: string };
  joinWaitlist: (classId: string) => { success: boolean; message: string };
  buyMembership: (plan: MembershipPlan) => { success: boolean; message: string };
  toggleNotifications: () => void;
  toggleSms: () => void;
  dismissToast: () => void;
  // Auth & Roles
  switchRole: (role: 'client' | 'admin') => void;
  loginUser: (phoneOrEmail: string, role?: 'client' | 'admin') => void;
  registerUser: (name: string, phone: string, email: string) => void;
  // Admin Operations
  addClass: (newClass: Omit<YogaClass, 'id' | 'bookedCount'>) => { success: boolean; message: string };
  deleteClass: (classId: string) => { success: boolean; message: string };
  toggleAttendeeCheckIn: (bookingId: string) => void;
  getClassAttendees: (classId: string) => Booking[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<YogaClass[]>(INITIAL_CLASSES);
  const [instructors] = useState<Instructor[]>(INSTRUCTORS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [user, setUser] = useState<UserProfile>(CLIENT_USER);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState<YogaCategory>('Все');
  const [selectedLevel, setSelectedLevel] = useState<string>('Все');
  const [membershipPlans] = useState<MembershipPlan[]>(MEMBERSHIP_PLANS);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  const dismissToast = () => setNotificationToast(null);

  // Switch role between Client and Admin for testing & administration
  const switchRole = (role: 'client' | 'admin') => {
    if (role === 'admin') {
      setUser(ADMIN_USER);
      showToast('🛡 Включен режим Администратора студии');
    } else {
      setUser(CLIENT_USER);
      showToast('👤 Включен режим Клиента');
    }
  };

  const loginUser = (phoneOrEmail: string, targetRole: 'client' | 'admin' = 'client') => {
    if (targetRole === 'admin' || phoneOrEmail.toLowerCase().includes('admin')) {
      setUser(ADMIN_USER);
      showToast('Вход выполнен: Администратор');
    } else {
      setUser({
        ...CLIENT_USER,
        phone: phoneOrEmail.includes('@') ? CLIENT_USER.phone : phoneOrEmail,
        email: phoneOrEmail.includes('@') ? phoneOrEmail : CLIENT_USER.email,
      });
      showToast(`Добро пожаловать, ${CLIENT_USER.name}!`);
    }
  };

  const registerUser = (name: string, phone: string, email: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim() || 'Новый практик',
      phone: phone.trim() || '+7 (900) 000-00-00',
      email: email.trim() || 'yoga@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      role: 'client',
      activeSubscription: {
        id: `sub-trial-${Date.now()}`,
        planId: 'plan-trial',
        planTitle: 'Пробное занятие (Бонус)',
        totalClasses: 1,
        remainingClasses: 1,
        validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: 'active',
      },
      attendedClassesCount: 0,
      totalMinutes: 0,
      currentStreak: 1,
      notificationsEnabled: true,
      smsReminders: true,
    };

    setUser(newUser);
    showToast(`🎉 Регистрация успешна! Вам начислен подарок: Пробное занятие.`);
  };

  const bookClass = (classId: string, useMembership: boolean) => {
    const yogaClass = classes.find((c) => c.id === classId);
    if (!yogaClass) return { success: false, message: 'Занятие не найдено' };

    // Check if user already booked
    const existing = bookings.find(
      (b) => b.classId === classId && b.userId === user.id && b.status === 'active'
    );
    if (existing) {
      return { success: false, message: 'Вы уже записаны на это занятие!' };
    }

    // Check capacity
    if (yogaClass.bookedCount >= yogaClass.capacity) {
      return { success: false, message: 'Группа заполнена. Вы можете записаться в лист ожидания.' };
    }

    if (useMembership) {
      if (
        !user.activeSubscription ||
        (user.activeSubscription.totalClasses !== 'unlimited' &&
          typeof user.activeSubscription.remainingClasses === 'number' &&
          user.activeSubscription.remainingClasses <= 0)
      ) {
        return { success: false, message: 'На вашем абонементе закончились занятия!' };
      }

      // Deduct class
      setUser((prev) => ({
        ...prev,
        activeSubscription: prev.activeSubscription
          ? {
              ...prev.activeSubscription,
              remainingClasses:
                prev.activeSubscription.totalClasses === 'unlimited'
                  ? 'unlimited'
                  : Math.max(
                      0,
                      (typeof prev.activeSubscription.remainingClasses === 'number'
                        ? prev.activeSubscription.remainingClasses
                        : 0) - 1
                    ),
            }
          : undefined,
      }));
    }

    // Increment booked count
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, bookedCount: c.bookedCount + 1 } : c))
    );

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      classId: yogaClass.id,
      className: yogaClass.title,
      category: yogaClass.category,
      instructorName: yogaClass.instructorName,
      date: yogaClass.date,
      startTime: yogaClass.startTime,
      endTime: yogaClass.endTime,
      room: yogaClass.room,
      bookedAt: new Date().toISOString(),
      status: 'active',
      qrCodeValue: `YOGA-PASS-${Math.floor(10000 + Math.random() * 90000)}-${user.name.slice(0, 3).toUpperCase()}`,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      attended: false,
      usedMembershipId: useMembership ? user.activeSubscription?.id : undefined,
      pricePaid: useMembership ? 0 : yogaClass.price,
    };

    setBookings((prev) => [newBooking, ...prev]);
    showToast(`✓ Вы успешно записались на "${yogaClass.title}"`);

    return { success: true, message: 'Вы успешно записаны на занятие!' };
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Запись не найдена' };

    // Update class count
    setClasses((prev) =>
      prev.map((c) =>
        c.id === booking.classId ? { ...c, bookedCount: Math.max(0, c.bookedCount - 1) } : c
      )
    );

    // Refund membership class if used
    if (booking.usedMembershipId && user.activeSubscription) {
      setUser((prev) => ({
        ...prev,
        activeSubscription: prev.activeSubscription
          ? {
              ...prev.activeSubscription,
              remainingClasses:
                prev.activeSubscription.totalClasses === 'unlimited'
                  ? 'unlimited'
                  : (typeof prev.activeSubscription.remainingClasses === 'number'
                      ? prev.activeSubscription.remainingClasses + 1
                      : 'unlimited'),
            }
          : undefined,
      }));
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    showToast(`Запись на "${booking.className}" отменена`);
    return { success: true, message: 'Запись успешно отменена' };
  };

  const joinWaitlist = (classId: string) => {
    const yogaClass = classes.find((c) => c.id === classId);
    if (!yogaClass) return { success: false, message: 'Занятие не найдено' };

    const newBooking: Booking = {
      id: `bk-wait-${Date.now()}`,
      classId: yogaClass.id,
      className: yogaClass.title,
      category: yogaClass.category,
      instructorName: yogaClass.instructorName,
      date: yogaClass.date,
      startTime: yogaClass.startTime,
      endTime: yogaClass.endTime,
      room: yogaClass.room,
      bookedAt: new Date().toISOString(),
      status: 'waitlist',
      qrCodeValue: `WAITLIST-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      attended: false,
    };

    setBookings((prev) => [newBooking, ...prev]);
    showToast(`✓ Вы добавлены в лист ожидания на "${yogaClass.title}". Мы пришлем пуш, если освободится место.`);
    return { success: true, message: 'Вы добавлены в лист ожидания' };
  };

  const buyMembership = (plan: MembershipPlan) => {
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + plan.validityDays);

    setUser((prev) => ({
      ...prev,
      activeSubscription: {
        id: `sub-${Date.now()}`,
        planId: plan.id,
        planTitle: plan.title,
        totalClasses: plan.classesCount,
        remainingClasses: plan.classesCount === 'unlimited' ? 999 : plan.classesCount,
        validUntil: validUntilDate.toISOString().split('T')[0],
        status: 'active',
      },
    }));

    showToast(`🎉 Поздравляем с покупкой "${plan.title}"!`);
    return { success: true, message: 'Абонемент успешно активирован!' };
  };

  const toggleNotifications = () => {
    setUser((prev) => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
  };

  const toggleSms = () => {
    setUser((prev) => ({ ...prev, smsReminders: !prev.smsReminders }));
  };

  // ADMIN METHODS
  const addClass = (newClassData: Omit<YogaClass, 'id' | 'bookedCount'>) => {
    if (user.role !== 'admin') {
      return { success: false, message: 'Доступ запрещен: действие доступно только администратору' };
    }

    const newClass: YogaClass = {
      ...newClassData,
      id: `cls-${Date.now()}`,
      bookedCount: 0,
    };

    setClasses((prev) => [newClass, ...prev]);
    showToast(`✓ Новое занятие "${newClass.title}" добавлено в расписание!`);
    return { success: true, message: 'Занятие успешно добавлено' };
  };

  const deleteClass = (classId: string) => {
    if (user.role !== 'admin') {
      return { success: false, message: 'Доступ запрещен: действие доступно только администратору' };
    }

    setClasses((prev) => prev.filter((c) => c.id !== classId));
    // Cancel related active bookings
    setBookings((prev) =>
      prev.map((b) => (b.classId === classId ? { ...b, status: 'cancelled' } : b))
    );

    showToast('Занятие удалено из расписания');
    return { success: true, message: 'Занятие удалено' };
  };

  const toggleAttendeeCheckIn = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, attended: !b.attended } : b))
    );
  };

  const getClassAttendees = (classId: string) => {
    return bookings.filter((b) => b.classId === classId && b.status !== 'cancelled');
  };

  return (
    <AppContext.Provider
      value={{
        classes,
        instructors,
        bookings,
        user,
        selectedDate,
        selectedCategory,
        selectedLevel,
        membershipPlans,
        notificationToast,
        setSelectedDate,
        setSelectedCategory,
        setSelectedLevel,
        bookClass,
        cancelBooking,
        joinWaitlist,
        buyMembership,
        toggleNotifications,
        toggleSms,
        dismissToast,
        switchRole,
        loginUser,
        registerUser,
        addClass,
        deleteClass,
        toggleAttendeeCheckIn,
        getClassAttendees,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
