import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';

interface IButtonSubmitProps {
    className?: string;
}

export function ButtonSubmit({ className }: IButtonSubmitProps) {

    const { pending } = useFormStatus() 

    return (
        <Button className={className}>{ pending ? "Saving..." : "Save"}</Button>
    )
}
