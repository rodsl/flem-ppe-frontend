/**
 * Animação de transição entre componentes
 * @module AnimatePresenceWrapper
 */


import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Component } from "react";
import { variants } from "styles/transitions";


/**
 * Animação de transição de componente.
 * @method AnimatePresenceWrapper
 * @memberof module:AnimatePresenceWrapper
 * @param {Component} children componente-filho da animação
 * @param {Object} isLoaded define estado de transição da animação. Se o
 * componente já estiver renderizado, ele encerra a animação
 * @returns componente com animação dependendo do estado do componente-alvo
 *
 */
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
