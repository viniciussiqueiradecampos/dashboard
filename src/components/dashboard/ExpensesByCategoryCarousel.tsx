import { useRef, useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryDonutCardProps {
    category: string;
    value: number;
    percentage: number;
    color: string;
}

function CategoryDonutCard({ category, value, percentage, color }: CategoryDonutCardProps) {
    const { formatCurrency } = useSettings();
    const { t } = useLanguage();

    // Donut settings - matching FIGMA dimensions
    const size = 64;
    const strokeWidth = 8;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[24px] w-[160px] min-h-[160px] p-4 shrink-0 transition-all duration-300 hover:border-[#D7FF00] shadow-sm hover:shadow-md group cursor-default">
            {/* Donut Chart */}
            <div className="relative flex items-center justify-center mb-3"> {/* space/12 gap */}
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-neutral-100 dark:text-neutral-800"
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
                <span className="absolute text-[12px] font-bold text-neutral-1100 dark:text-white">
                    {percentage.toFixed(0)}%
                </span>
            </div>

            <div className="flex flex-col items-center text-center w-full">
                <p className="text-[13px] text-neutral-500 dark:text-neutral-400 font-medium mb-1 truncate w-full">
                    {t(category)}
                </p>
                <h3 className="text-[16px] font-bold text-neutral-1100 dark:text-white whitespace-nowrap">
                    {formatCurrency(value)}
                </h3>
            </div>
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
            window.addEventListener('resize', checkArrows);
            return () => {
                el.removeEventListener('scroll', checkArrows);
                window.removeEventListener('resize', checkArrows);
            };
        }
    }, [expensesByCategory]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -170 : 170;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

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

    if (!expensesByCategory.length) return null;

    return (
        <div className="relative group/carousel w-full overflow-hidden mb-6">
            {/* Navigation Arrows */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-neutral-200 z-20 flex items-center justify-center text-neutral-400 hover:text-black transition-all opacity-0 group-hover/carousel:opacity-100 hidden lg:flex"
                >
                    <ChevronLeft size={16} />
                </button>
            )}
            {showRightArrow && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-sm border border-neutral-200 z-20 flex items-center justify-center text-neutral-400 hover:text-black transition-all opacity-0 group-hover/carousel:opacity-100 hidden lg:flex"
                >
                    <ChevronRight size={16} />
                </button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={cn(
                    "flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-2 px-1 scroll-smooth mb-[155px]",
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
            >
                {expensesByCategory.map((item) => (
                    <CategoryDonutCard
                        key={item.category}
                        category={item.category}
                        value={item.value}
                        percentage={getCategoryPercentage(item.category)}
                        color="#D7FF00"
                    />
                ))}
            </div>
        </div>
    );
}
