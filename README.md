# Yatrasathi

This project is built with the [T3 Stack](https://create.t3.gg/).

## Getting Started

To run the application:

1. Clone the repository:

```sh
git clone https://github.com/Sthabiraj/yatrasathi
```

2. Navigate to the project directory:

```sh
cd yatrasathi
```

3. Copy the example environment file and update it:

```sh
cp .env.example .env
```

4. Start the database:

```sh
docker compose up
```

5. Install dependencies:

```sh
pnpm install
```

6. Push the database schema:

```sh
pnpm run db:push
```

7. Start the development server:

```sh
pnpm run dev
```

## Resources

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Deployment

Refer to the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify), and [Docker](https://create.t3.gg/en/deployment/docker).

For more information, visit the [T3 Stack documentation](https://create.t3.gg/).
