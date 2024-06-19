//Add other values with '|' if needed
export type MailTemplate = 'TestnetRegistration'

export type PostDataSingleMailingParams = {
  name: string,
  surname: string
}
export type PostDataSingleMailing = {
  to: string
  params: PostDataSingleMailingParams
  templateName: MailTemplate
}