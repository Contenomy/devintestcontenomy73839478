import ExternalLoginBadge from "@components/ExternalLoginBadge";

import { environment }  from "@environment/environment.development";

export default function ExternalLogins() {
	return (
		<div className="flex flex-col gap-2">
			{environment.loginProviders.map((el) => {
				return (
					<ExternalLoginBadge key={el.name} provider={el} />
				);
			})}
		</div>
	);
}
