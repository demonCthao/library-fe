import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Undo,
    Heading1,
    Heading2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        editorProps: {
            attributes: {
                // Class cực kỳ quan trọng để chống vỡ layout và tràn chữ
                class: [
                    "prose prose-sm dark:prose-invert focus:outline-none",
                    "max-w-full p-4 min-h-[150px]",
                    "break-words [overflow-wrap:anywhere] [word-break:break-word]",
                    "whitespace-pre-wrap",
                ].join(" "),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Đồng bộ khi Form Reset hoặc dữ liệu từ API đổ về
    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    // Component phụ cho Toolbar để code sạch hơn
    const MenuBar = () => (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50 shrink-0">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
                icon={<Bold size={16} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive("italic")}
                icon={<Italic size={16} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive("heading", { level: 1 })}
                icon={<Heading1 size={16} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive("heading", { level: 2 })}
                icon={<Heading2 size={16} />}
            />
            <div className="w-[1px] h-6 bg-border mx-1" /> {/* Divider */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive("bulletList")}
                icon={<List size={16} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive("orderedList")}
                icon={<ListOrdered size={16} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive("blockquote")}
                icon={<Quote size={16} />}
            />
            <div className="flex-1" /> {/* Khoảng cách */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                icon={<Undo size={16} />}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                icon={<Redo size={16} />}
            />
        </div>
    );

    return (
        <div className="w-full border rounded-md border-input bg-background flex flex-col overflow-hidden focus-within:ring-1 focus-within:ring-ring transition-all">
            <MenuBar />
            {/* Giới hạn chiều cao và cho phép cuộn ở đây */}
            <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

// Component Button con cho Toolbar
const ToolbarButton = ({
    onClick,
    active,
    icon
}: {
    onClick: () => void;
    active?: boolean;
    icon: React.ReactNode
}) => (
    <Button
        type="button"
        variant={active ? "secondary" : "ghost"}
        size="sm"
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        className="h-8 w-8 p-0"
    >
        {icon}
    </Button>
);