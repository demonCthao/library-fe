import { SelectOption } from "./select-app";
import { LazyImage } from "./ui/image";

interface IExtendedSelectOption extends SelectOption {
    image?: string;
    publishYear?: number | string;
    price?: number | string;
}

interface ISearchSelectProps {
    options?: IExtendedSelectOption[];
    loading: boolean;
    onSelect: (value: SelectOption) => void;
}

export default function SearchSelect({
    options = [],
    loading = false,
    onSelect,
}: ISearchSelectProps) {
    
    return (
        <div className="relative w-full z-50 font-sans">
            <div className="absolute w-full bg-[#18181c] border border-gray-800 mt-2 rounded-xl shadow-2xl overflow-hidden max-h-[450px] flex flex-col">

                <div className="px-4 pt-4 pb-2 text-[#00b46f] text-xs font-bold tracking-wider uppercase">
                    Kết quả tìm kiếm
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-800/50 custom-scrollbar max-h-[380px]">
                    {loading && (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            <span className="inline-block animate-pulse">Đang tìm kiếm...</span>
                        </div>
                    )}

                    {!loading && options.length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Không tìm thấy kết quả phù hợp
                        </div>
                    )}

                    {!loading &&
                        options.map((item) => {
                            console.log("🚀 ~ SearchSelect ~ item:", item)
                            const isFree = !item.price || item.price === 0 || item.price === "Miễn phí";
                            const displayPrice = isFree
                                ? "Miễn phí"
                                : typeof item.price === 'number'
                                    ? `${item.price.toLocaleString('vi-VN')}đ`
                                    : `${Number(item.price).toLocaleString('vi-VN')}đ`;

                            return (
                                <div
                                    key={item.value}
                                    className="p-3 mx-2 my-1 rounded-lg flex gap-4 cursor-pointer transition-all duration-150 hover:bg-[#222227]"
                                    onClick={() => {
                                        onSelect?.(item);
                                    }}
                                >
                                    <div className="w-12 h-16 bg-gray-800 rounded overflow-hidden shrink-0 border border-gray-700/50 shadow flex items-center justify-center">
                                        {item.image ? (
                                            <LazyImage
                                                src={`http://127.0.0.1:3000${item.image}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[10px] text-gray-600">No Cover</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-center min-w-0 flex-1">
                                        <h4 className="text-sm font-semibold text-gray-100 truncate line-clamp-1 leading-snug">
                                            {item.label}
                                        </h4>

                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Năm XB: {item.publishYear ?? "Chưa rõ"}
                                        </p>

                                        <span className="text-xs font-bold mt-1 text-[#00b46f]">
                                            {displayPrice}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}