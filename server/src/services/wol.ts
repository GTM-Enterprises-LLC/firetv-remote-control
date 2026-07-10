import { createSocket } from 'dgram';

/**
 * Build a Wake-on-LAN "magic packet" for the given MAC address:
 * 6 bytes of 0xFF followed by the 6-byte MAC repeated 16 times (102 bytes total).
 */
function buildMagicPacket(mac: string): Buffer {
  const clean = mac.replace(/[^a-fA-F0-9]/g, '');
  if (clean.length !== 12) {
    throw new Error(`Invalid MAC address for Wake-on-LAN: "${mac}"`);
  }
  const macBytes = Buffer.from(clean, 'hex');
  const packet = Buffer.alloc(6 + 16 * 6, 0xff);
  for (let i = 0; i < 16; i++) {
    macBytes.copy(packet, 6 + i * 6);
  }
  return packet;
}

/**
 * Broadcast a Wake-on-LAN magic packet for `mac`.
 * Sends to the limited broadcast address on the standard WoL ports (9 and 7)
 * so it reaches the device regardless of which port it listens on.
 */
export async function sendMagicPacket(
  mac: string,
  { address = '255.255.255.255', ports = [9, 7] }: { address?: string; ports?: number[] } = {}
): Promise<void> {
  const packet = buildMagicPacket(mac);
  const socket = createSocket('udp4');

  await new Promise<void>((resolve, reject) => {
    socket.once('error', reject);
    socket.bind(() => {
      socket.setBroadcast(true);
      let remaining = ports.length;
      for (const port of ports) {
        socket.send(packet, 0, packet.length, port, address, (err) => {
          if (err) reject(err);
          if (--remaining === 0) resolve();
        });
      }
    });
  }).finally(() => socket.close());
}
