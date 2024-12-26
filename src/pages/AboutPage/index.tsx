import { useEffect } from 'react'
import useTitle from '@/hooks/useTitle'
import AboutHeroSection from '@/pages/AboutPage/AboutHeroSection'
import DescriptionSection from '@/pages/AboutPage/DescriptionSection'

const AboutPage = () => {
    useTitle('Stay Mate Hotel | Giới Thiệu')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="-mt-[150px]">
            <AboutHeroSection />
            <DescriptionSection />
        </div>
    )
}

export default AboutPage
