import { resend } from '@/app/lib/resend';
import { NextRequest, NextResponse } from 'next/server';
import InvoiceEmail from '@/components/templates/emails/Invoice';

type Tag = {
  name: string;
  value: string;
}

interface Props {
  template: string
  from: string;
  to: string | string[];
  bcc?: string | string[];
  cc?: string | string[];
  html?: string;
  reply_to?: string;
  subject: string;
  content: string;
  headers?: any;
  attachments?: Buffer | string;
  tags?: Tag[];
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("body", body)
  let { template, from, to, bcc, cc, html, reply_to, subject, content, headers, attachments, tags }: Props = body

  console.log(body)
    
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      react: InvoiceEmail(),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'missing content' });
  }
}