import { useRouter } from "next/router";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { DashboardLayout } from "components/Layout/DashboardLayout";
import { variants } from "styles/transitions";

export default function Dashboard({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;

  const session = useSession()
  console.log(session);




  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

  console.log(props);
  return (
    <>
      {!isLoaded ? (
        <>Loading...</>
      ) : (
        <>
          <AnimatePresence>
            <motion.div
              key={router.route}
              initial="pageInitial"
              animate="pageAnimate"
              exit="pageExit"
              variants={variants}
            >
              <DashboardLayout appName="Portal PPE">
                <Box bg="brand1.200" h="50vh">
                  <Button onClick={signOut} >
                    Logout
                  </Button>
                </Box>
                <Box bg="brand1.300" h="50vh">
                  oioi
                </Box>
                <Box bg="brand1.400" h="100vh">
                  oioi
                </Box>
              </DashboardLayout>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const {
    params: { entity },
  } = context;
  const entities = ["ba", "to", "rj"];
  // const posts = await api.getContentList({
  //   referenceName: "posts",
  //   languageCode: "en-us"
  // });
  // const page = posts.items.find((post) => {
  //   return post.fields.slug === ctx.params.slug.join("/");
  // });

  const entityCheck = entities.find((ent) => ent === entity || undefined);

  return {
    props: {
      entity: entityCheck || null,
    },
  };
}

Dashboard.auth = true;
