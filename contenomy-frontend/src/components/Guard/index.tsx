import { authContext } from "@context/AuthContext";
import React, { useContext } from "react";

export interface GuardProps {
	authenticated?: boolean;
	enableVisibilityRoles?: string[];
	requiredClaims?: {
		[key: string]: string;
	};
	children?: React.ReactNode;
}

export default function Guard({
	authenticated,
	enableVisibilityRoles,
	requiredClaims,
	children,
}: GuardProps) {
	let { profile } = useContext(authContext);

	let show = false;
	let hasClaims = false;

	authenticated ??= true;

	if (profile) {
		if (!authenticated) {
			show = !profile.isAuthenticated;
			hasClaims = true;
		} else {
			show =
				profile.isAuthenticated &&
				(!enableVisibilityRoles?.length ||
					enableVisibilityRoles.filter((e) => profile.roles.includes(e))
						.length > 0);

			hasClaims =
				!requiredClaims ||
				!Object.keys(requiredClaims).some((f: string) => {
					if (!profile.claims[f]) {
						return true;
					}

					return profile.claims[f] !== requiredClaims[f];
				});
		}
	}
	return show && hasClaims ? <>{children}</> : <></>;
}
