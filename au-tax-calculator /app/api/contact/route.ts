import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend only when API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!resend) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const data = await resend.emails.send({
      from: process.env.CONTACT_FROM || 'TaxEnd.AI <noreply@taxend.ai>',
      to: process.env.CONTACT_TO || 'hello@taxend.ai',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
