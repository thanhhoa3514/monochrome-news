import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Business Analyst',
        avatar: 'https://i.pravatar.cc/150?img=1',
        content: 'This platform has completely changed how I consume news. The personalized feed saves me hours every week.',
        rating: 5
    },
    {
        name: 'Michael Chen',
        role: 'Tech Entrepreneur',
        avatar: 'https://i.pravatar.cc/150?img=2',
        content: 'The quality of journalism and the speed of updates is unmatched. Highly recommended for professionals.',
        rating: 5
    },
    {
        name: 'Emily Rodriguez',
        role: 'Marketing Director',
        avatar: 'https://i.pravatar.cc/150?img=3',
        content: 'I love the global perspective and the ability to customize my news feed. Best news platform I have used.',
        rating: 5
    }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const TestimonialCard = memo(({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
        transition={{ delay: index * 0.15 }}
    >
        <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
));

TestimonialCard.displayName = 'TestimonialCard';

const Testimonials = () => {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <div className="mb-4 inline-flex bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-medium">Testimonials</div>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4">
                        Loved by Readers Worldwide
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        See what our community has to say about their experience.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(Testimonials);
