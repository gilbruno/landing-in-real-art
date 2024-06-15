This is the landing page of the project "In Real Art" : a fine artwork's web3 marketplace.<br>
It will embrace the blockchain technology with use of Non Fungible Token (NFT).<br>
This is built with [Next.js](https://nextjs.org/) and others front & back libraries.<br>

<img src="./public/img/Landing_IRA.png" alt="" title="">

It's fully responsive.

This application used some front libraries like : 
 - [Chakra](https://chakra-ui.com/)
 - [React Bootstrap](https://react-bootstrap.netlify.app/)


and some backend libraries : 

 - [Firebase](https://firebase.google.com/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Policy for SUpabase

Supabase requires policies for tables, functions and sequences.
During dev process, just open policies to anon with command : 

```sql
GRANT ALL ON all tables in SCHEMA public TO anon;
grant all privileges on all functions in schema public to anon;
grant all privileges on all sequences in schema public to anon;
```



