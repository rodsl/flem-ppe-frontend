import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { variants } from "styles/transitions";

export function AnimatePresenceWrapper({ children, isLoaded, router }) {
  return (
    <>
    {!isLoaded? (<>Carregando...</>): 
      <AnimatePresence>
      <motion.div
      key={router.route}
      initial="pageInitial"
      animate="pageAnimate"
      exit="pageExit"
      variants={variants}
      >
      <Box p={5}>{children}</Box>
      </motion.div>
      </AnimatePresence>
    }
    </>
  );
}
