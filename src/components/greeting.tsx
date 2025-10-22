import {motion} from "motion/react"

export default function Greeting() {
  return (
    <div className="mx-auto mt-4 flex size-full max-w-3xl flex-col justiy-center px-4 md:mt-16 md:px-8" key="overview">
      <motion.div animate={{ opacity: 1, y: 0}}
      className="font-semidbold text-xl md:text-2xl"
      exit={{opacity: 0, y: 10}}
      initial={{ opacity: 0, y: 10}}
      transition={{ delay: 0.5}}>
        Hi there!
      </motion.div>
      <motion.div
      animate={{opacity: 1, y: 0}}
      className="text-xl text-zince-500 md:text-2xl"
      exit={{opacity:0, y:10}}
      initial={{opacity:0, y:10}}
      transition={{delay: 0.5}}      
      >
        How can I help you today?
      </motion.div>
    </div>
  )
}