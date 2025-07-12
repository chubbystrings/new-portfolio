
import { useState } from "react";
// import AnimatedText from "../components/ui/AnimatedText";
import PageTransition from "../../components/ui/PageTransition";
import { GalleryCardWrapper } from "./gallery.style";
import { polaroidVariants } from "../../utils/variants";
import { animate, AnimatePresence, motion } from 'framer-motion';

interface Image {
    image: string;
    caption: string;
    alt: string;
    id: string;
    description: string;
}

const images: Image[] = [
    {
        image: "https://i.imgur.com/dJPnsDy.jpeg[/img]",
        caption: "Suited up for a party",
        alt: "Suited up for a party",
        id: "1",
        description: "A sophisticated portrait capturing the essence of formal elegance. The subject is impeccably dressed in a tailored suit, exuding confidence and style. The lighting highlights the sharp lines of the suit and the determined expression, suggesting this was taken before an important social event or professional gathering. The composition emphasizes both the sartorial choice and the poised demeanor, making it a perfect representation of someone ready to make an impression."
    },
    {
        image: "https://i.imgur.com/xOvABnZ.jpeg[/img]",
        caption: "Lakowe lake resort",
        alt: "Lakowe lake resort",
        id: "2",
        description: "A serene lakeside retreat showcasing the natural beauty of Lakowe Lake Resort. The tranquil waters reflect the sky above, creating a mirror-like surface that enhances the peaceful atmosphere. Surrounded by lush greenery and possibly palm trees, this resort offers a perfect escape from urban life. The composition captures the harmony between man-made luxury and natural splendor, inviting viewers to imagine themselves relaxing by the water's edge, enjoying the gentle breeze and the soothing sounds of nature."
    },
    {
        image: "https://i.imgur.com/2MH57SO.jpeg[/img]",
        caption: "Beach day",
        alt: "Beach day",
        id: "3",
        description: "A vibrant beach scene that captures the joy and freedom of a perfect day by the ocean. The golden sand stretches invitingly, while the azure waters of the sea create a stunning contrast against the shoreline. This image likely shows people enjoying various beach activities - from sunbathing and swimming to beach games and relaxation. The natural lighting suggests either early morning or late afternoon, when the sun casts the most beautiful golden hues across the landscape, making it an ideal time for photography and outdoor enjoyment."
    },
    {
        image: "https://i.imgur.com/xkUaDz7.jpeg[/img]",
        caption: "Country home",
        alt: "Country home",
        id: "4",
        description: "A charming country residence that embodies rustic elegance and rural tranquility. This home likely features traditional architecture with modern comforts, surrounded by expansive grounds that offer privacy and connection to nature. The property probably includes well-maintained gardens, possibly some farmland, and stunning views of the countryside. This type of setting provides the perfect balance between peaceful solitude and comfortable living, making it an ideal retreat for those seeking to escape the hustle and bustle of city life while maintaining all the amenities of modern living."
    },
    {
        image: "https://i.imgur.com/dIr6pLN.jpeg[/img]",
        caption: "Mama and Zee!!",
        alt: "Mama and Zee!",
        id: "5",
        description: "A heartwarming family moment captured between a mother and her child, affectionately nicknamed 'Zee'. This candid photograph likely shows genuine joy and love, with both subjects sharing a special bond that's evident in their expressions and body language. Such family portraits are precious keepsakes that document the beautiful relationship between parent and child, capturing a moment of pure happiness that can be cherished for years to come. The exclamation marks in the caption suggest this was a particularly special or memorable moment worth celebrating."
    },
]

export default function GalleryComponent() {

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<Image | null>(null);

    const [isAnimationComplete, setIsAnimationComplete] = useState(false);

    function handleClick(item: Image) {
        setSelectedId(item.id);
        setSelectedItem(item);
    }

    const handleAnimate = (y: any) => {
        const cardId = `#card-${selectedId}`;
        animate(cardId, {
            opacity: y.opacity === 1 ? 0 : 1,
        }, {
            duration: 0.1,
        })
    }


    return (
        <>
            <PageTransition onAnimationComplete={() => {
                setIsAnimationComplete(true);

            }} />
            {
                isAnimationComplete && (

                    <GalleryCardWrapper>
                        {images.map((image, index) => (
                            <motion.div onClick={() => handleClick(image)} id={`card-${image.id}`} initial="offscreen" whileInView="onscreen" variants={polaroidVariants(index)} className="item cursor-pointer" key={`${image.alt}-${index}`}>
                                <div className="polaroid"><img src={image.image} alt={image.alt} />
                                    <div className="caption">{image.caption}</div>
                                </div>
                            </motion.div>
                        ))}

                        <AnimatePresence mode="wait">
                            {selectedId && selectedItem && (
                                <motion.div
                                    onClick={() => setSelectedId(null)}
                                    className="modal"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, }}
                                    exit={{ opacity: 0 }}
                                    onAnimationComplete={(y) => {
                                        handleAnimate(y)
                                    }}
                                >
                                    <motion.div

                                        onClick={(e) => e.stopPropagation()}
                                        className="modal-card"
                                    >
                                        <div className="modal-card-image"><img src={selectedItem.image} alt={selectedItem.alt} />
                                            <div className="">{selectedItem.caption}</div>
                                        </div>
                                        {/* <div className="modal-card-description">
                                            <p>{selectedItem.description}</p>
                                        </div> */}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </GalleryCardWrapper>
                )
            }
        </>
    );
}
