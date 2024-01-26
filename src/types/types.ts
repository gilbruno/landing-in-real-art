export type Lang = 'CN' | 'EN' | 'FR'

export const defaultLangObject = {
    'CN': '',
    'EN': '',
    'FR': ''
}

export type HeaderButtons = {
    JoinIRA: Record<Lang,string>,
    StartIRA: Record<Lang,string>
    JoinIRALink: string,
    StartIRALink: string
}

export type HeaderTexts = {
    title1: Record<Lang,string> 
    title2: Record<Lang,string> 
    text1: Record<Lang,string>
}


export type HeaderData = HeaderButtons & HeaderTexts

export interface FooterTexts {
    emailTitle: Record<Lang, string>,
    emailPlaceHolder: Record<Lang, string>
}  

export interface FooterData<T extends string> {
    twitterUrl: T
    instagramUrl: T
    linkedInUrl: T
    teamLinkUrl: T
    partnersLinkUrl: T
    Email: string
    Telephone: T
    Adresse: T
    text: Record<Lang, T>
    ourCompanyTitle: Record<Lang, T>
    teamLinkText: Record<Lang, T>
    partnersLinkText: Record<Lang, T>
    contactTitle: Record<Lang, T>
    block1: FooterBlock
    block2: FooterBlock,
    emailTitle: Record<Lang, T>,
    emailPlaceHolder: Record<Lang, T>,
  }

export interface FooterBlock {
    title: Record<Lang, string>
    lines: Array<FooterBlockLine>
}  

export interface FooterBlockLine {
    text: Record<Lang, string>
    url: string

}


export type NewsletterText<T extends Record<Lang, string>> = {
    title: T
    description: T
    email_placeholder: T
    checkboxNewsLetter: T
    checkboxPrivateSale: T
    sendEmailErrorMsg: T
}  

export type PartnersTexts<T extends Record<Lang, string>> = {
    mainTitle: T
}  

export type PartnersData = PartnersTexts<Record<Lang, string>>

export type PrivateSaleText = {
    title: Record<Lang, string>
    description: Record<Lang, string>
    email_placeholder: Record<Lang, string>
}  

export type NewsletterData = NewsletterText<Record<Lang, string>>

export type PrivateSaleData = PrivateSaleText

export type FaqButtons = {
    readFaq: Record<Lang, string>
    readFaqLink: string
}  

export type FaqTexts<T extends Record<Lang, string>> = {
    faqTitle: T
    faqMain: T
    question1: T
    question2: T
    question3: T
    answer1: T
    answer2: T
    answer3: T
}  

export type FaqPageMenu = {
    items: Array<FaqQuestion>,
    textButton: Record<Lang, string>
}

export type FaqPage = {
    faqNFT: FaqPageMenu,
    faqProject: FaqPageMenu
}


export type FaqQuestion = {
    answer: Record<Lang, string>,
    question: Record<Lang, string>
}

export type FaqQuestions = {
    questions: Array<FaqQuestion>
}

export type HelpIraData = FaqButtons & FaqTexts<Record<Lang, string>>


export interface ArtistsData {
    title: Record<Lang, string>
    description: Record<Lang, string>
  }

export interface ArtistNameDesc {
    name: string
    desc: Record<Lang, string>
    image: string
}  

export type ArtistCarouselElement = Record<string, ArtistNameDesc>


export type Artists  = Array<ArtistNameDesc>

export interface JoinIraDataButton {
    JoinIRA: Record<Lang, string>
    StartIRA: Record<Lang, string>
    JoinIRALink: string
    StartIRALink: string
}

export interface JoinIraDataText {
    text1: Record<Lang, string>
    text2: Record<Lang, string>
    headerText: Record<Lang, string>
}


export type JoinIraData = JoinIraDataButton & JoinIraDataText

export type JoinTrendButtons = {
    artgallery_join: Record<Lang, string>
    artgallery_join_link: string
    aas_join: Record<Lang, string>
    aas_join_link: string
    marketplace_join: Record<Lang, string>
    marketplace_join_link: string    
}

export type JoinTrendTexts = {
    title: Record<Lang, string>
    artgallery_title: Record<Lang, string>
    artgallery_description: Record<Lang, string>
    aas_title: Record<Lang, string>
    aas_description: Record<Lang, string>
    marketplace_title: Record<Lang, string>
    marketplace_description: Record<Lang, string>
}

export type JoinTrendData = JoinTrendButtons & JoinTrendTexts

export type MenuButtons = {
    Presale: Record<Lang, string>,
    Testnet: Record<Lang, string>
}

export type MenuElements = {
    About: Record<Lang, string>,
    Community: Record<Lang, string>
    Team: Record<Lang, string>
    Resources: Record<Lang, string>
    AboutLink: string
    CommunityLink: string
    TeamLink: string
    ResourcesLink: string
}


export type MenuData = MenuButtons & MenuElements


export type MemberData = {
    text1: Record<Lang,string>
    text2: Record<Lang,string>
    role: Record<Lang,string>
    name: string
    photo: string
  }[];


export interface TeamMemberProps {
    name: string
    photo: string
    role: string
    text1: string
    text2: string
}
  
export interface ArtistMemberProps {
    name: string
    image: string
    desc: string
}

export interface PresaleDataTexts {
    title1: Record<Lang, string>
    title2: Record<Lang, string>
    description: Record<Lang, string>
}

export interface PresaleDataButtons {
    seeDrop: Record<Lang, string>
    seeDropLink: string
}

export interface PresaleDropPanelArtworks {
    artworks: PresaleArtWorks
}

export type PresaleArtWorks  = Array<PresaleArtWork>

export type PresaleArtWork = {
    description: Record<Lang, string>,
    image: string
    url: string
}

export interface PresaleDropPanelButtons {
    acquireArtWork: Record<Lang, string>,
    closeArtworkDetail: Record<Lang, string>,
    detailArtWork: Record<Lang, string>,
    viewMoreArtworks: Record<Lang, string>
}

export interface PresaleDropPanelTexts {
    endDrop: Record<Lang, string>
}

export type PresaleDropPanelData = PresaleDropPanelArtworks & PresaleDropPanelButtons & PresaleDropPanelTexts
