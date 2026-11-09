import QRCode from 'qrcode';

/**
 * Generate high-resolution base64 PNG data URL of a QR code
 */
export const generateQrDataUrl = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    return '';
  }
};
