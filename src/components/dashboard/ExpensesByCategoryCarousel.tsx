import { useRef, useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryDonutCardProps {
    category: string;
    value: number;
    percentage: number;
    color: string;
}

function CategoryDonutCard({ category, value, percentage, color }: CategoryDonutCardProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(val);
    };

    // Donut settings
    const size = 72;
    const strokeWidth = 8;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center p-6 bg-white border border-neutral-200 rounded-[32px] w-[185px] h-[190px] shrink-0 transition-all duration-300 hover:border-[#D7FF00] group cursor-default shadow-sm hover:shadow-md">
            {/* Donut Chart */}
            <div className="relative flex items-center justify-center mb-4">
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="#F3F4F6"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                    />
                </svg>
                <span className="absolute text-[13px] font-bold text-neutral-1100">
                    {percentage.toFixed(0)}%
                </span>
            </div>

            <p className="text-[14px] text-neutral-500 font-medium mb-1 truncate w-full text-center">
                {category}
            </p>
            <h3 className="text-[18px] font-bold text-neutral-1100 whitespace-nowrap">
                {formatCurrency(value)}
            </h3>
        </div>
    );
}

export function ExpensesByCategoryCarousel() {
    const { expensesByCategory, getCategoryPercentage } = useFinance();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Dynamic colors for donuts based on the requested rotation
    const colors = ['#D7FF00', '#080B12', '#94A3B8', '#64748B'];

    const checkArrows = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkArrows);
            checkArrows();
            return () => el.removeEventListener('scroll', checkArrows);
        }
    }, [expensesByCategory]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Drag to scroll logic
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    // Mouse wheel scroll logic
    const handleWheel = (e: React.WheelEvent) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    if (!expensesByCategory.length) return null;

    return (
        <div className="relative group/carousel w-full mb-8 overflow-hidden">
            {/* Mask Gradients for Fade Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-200 to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-200 to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity" />

            {/* Navigation Arrows (Visible on Hover) */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-100 z-20 flex items-center justify-center text-neutral-600 hover:text-black hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 hidden lg:flex"
                >
                    <ChevronLeft size={20} />
                </button>
            )}
            {showRightArrow && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-100 z-20 flex items-center justify-center text-neutral-600 hover:text-black hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 hidden lg:flex"
                >
                    <ChevronRight size={20} />
                </button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className={cn(
                    "flex gap-5 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth",
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
            >
                {expensesByCategory.map((item, index) => (
                    <CategoryDonutCard
                        key={item.category}
                        category={item.category}
                        value={item.value}
                        percentage={getCategoryPercentage(item.category)}
                        color={colors[index % colors.length]}
                    />
                ))}
            </div>
        </div>
    );
}
