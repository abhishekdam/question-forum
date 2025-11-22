import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export type SortOption = "votes" | "recent";

interface SortSelectProps {
	value: SortOption;
	onChange: (value: SortOption) => void;
}

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="votes">Most Votes</SelectItem>
				<SelectItem value="recent">Most Recent</SelectItem>
			</SelectContent>
		</Select>
	);
};
