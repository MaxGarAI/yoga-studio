export type YogaLevel = 'Все уровни' | 'Для начинающих' | 'Средний' | 'Продвинутый';

export type YogaCategory =
  | 'Все'
  | 'Хатха-йога'
  | 'Виньяса-флоу'
  | 'Аэройога'
  | 'Инь-йога'
  | 'Аштанга'
  | 'Медитация и пранаяма'
  | 'Sound Healing';

export interface Instructor {
  id: string;
  name: string;
  title: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  bio: string;
  avatar: string;
  specialties: string[];
}

export interface YogaClass {
  id: string;
  title: string;
  category: YogaCategory;
  level: YogaLevel;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  room: string;
  capacity: number;
  bookedCount: number;
  price: number;
  description: string;
  benefits: string[];
  equipmentNeeded: string[];
  intensity: 1 | 2 | 3 | 4 | 5;
  image: string;
}

export interface Booking {
  id: string;
  classId: string;
  className: string;
  category: YogaCategory;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  bookedAt: string;
  status: 'active' | 'completed' | 'cancelled' | 'waitlist';
  qrCodeValue: string;
  userId: string;
  userName: string;
  userPhone: string;
  attended?: boolean;
  pricePaid?: number;
  usedMembershipId?: string;
}

export interface MembershipPlan {
  id: string;
  title: string;
  description: string;
  classesCount: number | 'unlimited';
  validityDays: number;
  price: number;
  originalPrice?: number;
  isPopular?: boolean;
  isTrial?: boolean;
  features: string[];
}

export interface UserSubscription {
  id: string;
  planId: string;
  planTitle: string;
  totalClasses: number | 'unlimited';
  remainingClasses: number | 'unlimited';
  validUntil: string;
  status: 'active' | 'expired';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  role: 'client' | 'admin';
  activeSubscription?: UserSubscription;
  attendedClassesCount: number;
  totalMinutes: number;
  currentStreak: number;
  notificationsEnabled: boolean;
  smsReminders: boolean;
}
