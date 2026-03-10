import { SelectOption } from "./select-app";

interface ISearchSelectProps {
    options?: SelectOption[];
    loading: boolean;
    onSelect: (value: SelectOption) => void
}

export default function SearchSelect({
    options = [],
    loading = false,
    onSelect,
}: ISearchSelectProps) {

    return (
        <div className="relative w-full z-50">
            <div className="absolute w-full border bg-white mt-1 rounded shadow">
                {loading && (
                    <div className="p-2 text-gray-500">Loading...</div>
                )}

                {!loading && options.length === 0 && (
                    <div className="p-2 text-gray-400">No data</div>
                )}

                {!loading &&
                    options.map((item) => (
                        <div
                            key={item.value}
                            className="p-2 hover:bg-gray-100 cursor-pointer bg-white"
                            onClick={() => {
                                onSelect?.(item);
                            }}
                        >
                            {item.label}
                        </div>
                    ))}
            </div>
        </div>
    );
}