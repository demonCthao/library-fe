import { HeroSlider } from "@/components/hero-slider";
import Loading from "@/components/loading";
import { LazyImage } from "@/components/ui/image";
import { useFetch } from "@/hooks/useFetch";
import { Category } from "@/models/category.model";
import { useNavigate } from "@tanstack/react-router";

export default function UserMain() {
    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useFetch<Category[]>({
        url: "category-books",
        key: ["category-books"],
    });

    const goToBookDetail = (id: number) => {
         navigate({
            to: "/user-book-detail/" + id,
            replace: true
        });
    }

    return (
        <div className="overflow-y-auto">
            <HeroSlider />
            {
                isLoading ? <Loading /> :
                    <div className="px-[50px]">
                        {
                            data?.filter(c => c?.books && c?.books.length > 0)?.map(category => {
                                return <div>
                                    <div className="mt-10">
                                        <h1 className="text-f2f text-xl font-medium cursor-pointer">{category.name}</h1>
                                    </div>
                                    <div className="flex gap-10 mt-5">
                                        {
                                            category.books?.map(book => {
                                                return <div className="cursor-pointer" onClick={() => goToBookDetail(book.id)}>
                                                    <LazyImage className="w-[250px] h-[380px] rounded-lg"  src={`http://127.0.0.1:3000${book.avatar_path}`} />
                                                    <div className="mt-3">
                                                        {book.title}
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            })
                        }
                    </div>
            }
        </div>
    )
}
