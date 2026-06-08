
import { motion } from "motion/react"



export default function Pala(){
    return (
        <motion.header
        initial={{ opacity: 0, translateY: -100 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 1 }}
        
        className="absolute top-0 h-32 w-full bg-[#222831] z-10 flex gap-5 p-4 text-center flex-col items-center justify-center text-white font-sans font-bold">
            <h1 className="text-2xl my-1 bg-linear-to-r from-[#00ADB5] to-white text-transparent bg-clip-text">Batagors B2R Framework</h1>
            <p className="text-xs max-w-2xl bg-linear-to-r from-[#00ADB5] to-white text-transparent bg-clip-text">Framework ku buat main CTF boot to root udah sih itu aja, webnya masih dalam pengembangan lagian masih AI slop banget anjay aku ga jago D3 JS yah ini sekalian belajar aja sih, so selamat mencoba</p>
        </motion.header>
    )
}