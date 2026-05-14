'use client'

import { ButtonHTMLAttributes, FC } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string
    variant?: 'primary' | 'secondary'
    classes?: string
    animate?: boolean
    delay?: number
}

const MotionButton: FC<Props> = ({ label, classes, ...props }) => {
    return (
        <button
            {...props}
            className={cn(
                'bg-white/5 border border-white/10 group relative h-14 w-full cursor-pointer rounded-full px-1 outline-none disabled:opacity-50 disabled:pointer-events-none',
                classes
            )}
        >
            <span
                className='circle bg-white m-0 block h-12 w-12 overflow-hidden rounded-full duration-500 group-hover:w-full'
                aria-hidden='true'
            ></span>
            <div className='icon absolute top-1/2 left-4 translate-x-0 -translate-y-1/2 duration-500 group-hover:translate-x-[0.4rem] z-10'>
                <ArrowRight className='text-[#0a0a0a] size-6' />
            </div>
            <span className='button-text text-gray-200 group-hover:text-[#0a0a0a] font-sans absolute top-2/4 left-2/4 ml-4 -translate-x-2/4 -translate-y-2/4 text-center text-lg font-semibold tracking-tight whitespace-nowrap duration-500 z-10'>
                {label}
            </span>
        </button>
    )
}

export default MotionButton
