import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

/**
 * Sort option type
 *
 * - "votes": Sort by vote count (descending)
 * - "recent": Sort by creation date (descending - newest first)
 */
export type SortOption = "votes" | "recent";

interface SortSelectProps {
	// Current sort option selected
	// Type: SortOption ("votes" | "recent")
	value: SortOption;

	// Callback function when sort option changes
	// Receives: new sort option value
	onChange: (value: SortOption) => void;
}

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
	return (
		<Select value={value} onValueChange={onChange}>
			{/* Dropdown Trigger Button */}
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>

			{/* Dropdown Menu Content */}
			<SelectContent>
				{/* Sort by Vote Count - Popular/Helpful Posts First */}
				<SelectItem value="votes">Most Votes</SelectItem>

				{/* Sort by Recent Date - Newest Posts First */}
				<SelectItem value="recent">Most Recent</SelectItem>
			</SelectContent>
		</Select>
	);
};
