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

export interface FooterData {
    twitterUrl: string
    instagramUrl: string
    linkedInUrl: string
    teamLinkUrl: string
    partnersLinkUrl: string
    Email: string
    Telephone: string
    Adresse: string
    text: Record<Lang, string>
    ourCompanyTitle: Record<Lang, string>
    teamLinkText: Record<Lang, string>
    partnersLinkText: Record<Lang, string>
    contactTitle: Record<Lang, string>
    block1: FooterBlock
    block2: FooterBlock
  }

export interface FooterBlock {
    title: Record<Lang, string>
    lines: Array<FooterBlockLine>
}  

export interface FooterBlockLine {
    text: Record<Lang, string>
    url: string

}

export type NewsletterText = {
    title: Record<Lang, string>
    description: Record<Lang, string>
    email_placeholder: Record<Lang, string>
}  

export type PrivateSaleText = {
    title: Record<Lang, string>
    description: Record<Lang, string>
    email_placeholder: Record<Lang, string>
}  

export type NewsletterData = NewsletterText

export type PrivateSaleData = PrivateSaleText

export type FaqButtons = {
    readFaq: Record<Lang, string>
    readFaqLink: string
}  

export type FaqTexts = {
    faqMain: Record<Lang, string>
    question1: Record<Lang, string>
    question2: Record<Lang, string>
    question3: Record<Lang, string>
    answer1: Record<Lang, string>
    answer2: Record<Lang, string>
    answer3: Record<Lang, string>
  
}  

export type HelpIraData = FaqButtons & FaqTexts


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
  
export interface PresaleDataTexts {
    title1: Record<Lang, string>
    title2: Record<Lang, string>
    description: Record<Lang, string>
}

export interface PresaleDataButtons {
    seeDrop: Record<Lang, string>
    seeDropLink: string
}
