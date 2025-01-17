import "./layout.css";
import Info from "./info/info";

export default function UserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="mx-96 mt-40 grid grid-cols-2 grid-rows-1">
				<Info />
				<div className="flex justify-center w-100">{children}</div>
			</div>
		</>
	);
}
