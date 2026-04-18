import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export const sendSMS = async (to: string, body: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SMS] To: ${to} | Message: ${body}`)
    return
  }
  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
    body,
  })
}

export const sendApplicationSMS = async (
  to:          string,
  companyName: string,
  status:      string
): Promise<void> => {
  await sendSMS(
    to,
    `Internship System: Your application to ${companyName} status is now "${status}". Log in for details.`
  )
}

export const sendEvaluationReminderSMS = async (
  to:        string,
  firstName: string,
  dueDate:   string
): Promise<void> => {
  await sendSMS(
    to,
    `Hi ${firstName}, your internship evaluation is due by ${dueDate}. Please log in to complete it.`
  )
}
