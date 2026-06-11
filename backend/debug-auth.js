require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg }     = require('@prisma/adapter-pg')
const bcrypt           = require('bcryptjs')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma  = new PrismaClient({ adapter })

async function main() {
  const email = 'mwizerwaplacidie@gmail.com'

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    console.log('❌ User NOT found in database.')
    console.log('   This means registration failed (500 error).')
    console.log('   Check the backend terminal for the actual error message.')
    return
  }

  console.log('✓ User found:')
  console.log('  id         :', user.id)
  console.log('  email      :', user.email)
  console.log('  role       :', user.role)
  console.log('  isActive   :', user.isActive)
  console.log('  otpCode    :', user.otpCode ?? '(null — no OTP stored)')
  console.log('  otpExpiry  :', user.otpExpiry ?? '(null)')

  if (user.otpExpiry && new Date() > user.otpExpiry) {
    console.log('  ⚠️  OTP has EXPIRED')
  } else if (user.otpCode) {
    console.log('  ✓ OTP is still valid')
    const remaining = user.otpExpiry
      ? Math.round((user.otpExpiry.getTime() - Date.now()) / 1000)
      : 0
    console.log('  Time left  :', remaining, 'seconds')
  }
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect())
