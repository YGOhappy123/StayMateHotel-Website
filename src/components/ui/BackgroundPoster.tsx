import { twMerge } from 'tailwind-merge'

type BackgroundPosterProps = {
    imageUrl: string
    size: 'big' | 'small'
}

const BackgroundPoster = ({ imageUrl, size }: BackgroundPosterProps) => {
    return (
        <div
            className={twMerge(
                `relative -z-[1] bg-cover bg-center after:pointer-events-none after:absolute after:inset-0 after:bg-poster after:content-[""] ${size === 'big' ? 'pt-[50%]' : 'pt-[40%]'}`
            )}
            style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
    )
}

export default BackgroundPoster
