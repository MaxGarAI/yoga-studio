import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { Booking } from '../types';

interface QrModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ visible, booking, onClose }) => {
  if (!booking) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Электронный пропуск</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.classTitle}>{booking.className}</Text>
            <Text style={styles.metaText}>
              {booking.date} • {booking.startTime} – {booking.endTime}
            </Text>
            <Text style={styles.roomText}>{booking.room}</Text>

            {/* Simulated QR Code Graphic */}
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <View style={styles.qrRow}>
                  <View style={[styles.qrCornerBlock, styles.qrCornerTL]} />
                  <View style={styles.qrPatternMiddle} />
                  <View style={[styles.qrCornerBlock, styles.qrCornerTR]} />
                </View>
                <View style={styles.qrCenterPattern}>
                  <Text style={styles.qrSymbolText}>🕉</Text>
                </View>
                <View style={styles.qrRow}>
                  <View style={[styles.qrCornerBlock, styles.qrCornerBL]} />
                  <View style={styles.qrPatternMiddle} />
                  <View style={styles.qrPatternMini} />
                </View>
              </View>
              <Text style={styles.qrCodeString}>{booking.qrCodeValue}</Text>
            </View>

            <Text style={styles.hintText}>
              Покажите этот экран администратору при входе в студию
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={0.85} onPress={onClose} style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.glow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  body: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.primaryLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  roomText: {
    fontSize: 13,
    color: Colors.goldLight,
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    justifyContent: 'space-between',
    padding: 4,
  },
  qrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrCornerBlock: {
    width: 48,
    height: 48,
    backgroundColor: '#0D1412',
    borderWidth: 4,
    borderColor: '#0D1412',
    borderRadius: 6,
  },
  qrCornerTL: {},
  qrCornerTR: {},
  qrCornerBL: {},
  qrPatternMiddle: {
    width: 40,
    height: 24,
    backgroundColor: '#0D1412',
    borderRadius: 4,
  },
  qrPatternMini: {
    width: 32,
    height: 32,
    backgroundColor: '#0D1412',
    borderRadius: 4,
  },
  qrCenterPattern: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrSymbolText: {
    fontSize: 36,
    color: '#0D1412',
  },
  qrCodeString: {
    color: '#0D1412',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 10,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  doneBtn: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  doneBtnText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
