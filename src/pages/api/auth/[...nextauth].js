import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authUser, getUserGroups, getUserInfo } from "services/ldapService";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "ldap",
      name: "LDAP Authentication",
      credentials: {
        username: { label: "User", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      type: "credentials",
      async authorize(credentials, req) {
        // You might want to pull this call out so we're not making a new LDAP client on every login attemp

        // const auth = () =>
        //   new Promise((resolve, reject) => {
        //     client.bind(
        //       credentials.username,
        //       credentials.password,
        //       (err, res) => {
        //         if (err) {
        //           console.error("Failed");
        //           reject(new ldap.InvalidCredentialsError());
        //         } else {
        //           console.log("Logged in");
        //           resolve(res);
        //         }
        //       }
        //     );
        //   });
        // try {
        //   const result = await auth();
        //   return result;
        // } catch (error) {
        //   console.log(error);
        //   return null;
        // }

        try {
          // console.log(credentials)
          const auth = await authUser(
            credentials.username,
            credentials.password
          );
          if (auth) {
            const user = await getUserInfo(credentials.username);
            const userGroups = await getUserGroups(credentials.username);
            return { user, userGroups };
          }
          return null;
        } catch (error) {
          console.log(error.message);
          return false;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("user", user);
      if (user) {
        return true;
      }
      return false;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log( token, user, account, profile, isNewUser)
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.username = user.username;
        token.password = user.password;
        token.ldap = user;
      }
      return token;
    },
    async session({ session, user, token }) {
      // console.log(session, user);
      return {
        ...session,
        user: {
          username: token.username,
          ...token.ldap.user,
          roles: { ...token.ldap.userGroups },
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
