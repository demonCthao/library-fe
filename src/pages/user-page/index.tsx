import { HeroSlider } from "@/components/hero-slider";
import Loading from "@/components/loading";
import { useFetch } from "@/hooks/useFetch";
import { Category } from "@/models/category.model";
import { useNavigate } from "@tanstack/react-router";
import { BookItem } from "./book-items";

export default function UserMain() {
    const navigate = useNavigate();
    const { data, isLoading } = useFetch<Category[]>({
        url: "category-books",
        key: ["category-books"],
    });

    const goToBookDetail = (id: number) => {
        navigate({
            to: "/user-book-detail/" + id,
            // replace: true // Bạn có thể bỏ replace nếu muốn quay lại trang chủ bằng nút Back
        });
    }

    const handleBuy = (id: number) => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            navigate({
                to: "/login",
            });

            return
        }

        navigate({
            to: "/user-page-book/" + id,
        });
    }

    const goToCategoryDetail = (id: number) => {
        navigate({
            to: "/user-page-category-detail/" + id,
        });
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white">
            <HeroSlider />

            <div className="px-[50px] pb-20">
                {data?.filter(c => c?.books && c?.books.length > 0)?.map(category => (
                    <div key={category.id} className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold border-l-4 border-emerald-500 pl-4">
                                {category.name}
                            </h2>
                            <button onClick={() => goToCategoryDetail(category.id)} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">
                                Xem tất cả
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-8">
                            {category.books?.map(book => (
                                <BookItem
                                    key={book.id}
                                    book={book}
                                    onClick={() => goToBookDetail(book.id)}
                                    onClickCart={() => handleBuy(book.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}