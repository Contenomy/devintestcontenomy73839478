import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

import "./Popup.css";

export interface PopupProps {
	children?: React.ReactNode;
	widht?: number | string;
	height?: number | string;
	showHideButton?: boolean;
	visible: boolean;
	showTitle?: boolean;
	hideOnEscapePress?: boolean;
	onHidden?: Function;
}

export function Popup({
	children,
	onHidden,
	visible: popupVisible,
	hideOnEscapePress,
	...props
}: PopupProps) {
	const [visible, setVisible] = useState(false);


    let _hideOnEscapePress = true;
    
    if (hideOnEscapePress !== undefined) {
        _hideOnEscapePress = hideOnEscapePress;
    }

	useEffect(() => {
		setVisible(popupVisible);
	}, [popupVisible]);

	const hideCallback = useCallback(() => {
		setVisible(false);
		if (onHidden) {
			onHidden();
		}
	}, [setVisible, onHidden]);

	const escPressHandle = useCallback(
		(evt: KeyboardEvent<HTMLElement>) => {
			if (!_hideOnEscapePress) {
				return;
			}
			if (evt.key === "Escape") {
				hideCallback();
			}
		},
		[hideCallback, _hideOnEscapePress]
	);

	if (!visible) {
		return <></>;
	}

	return (
		<>
			<div
				className="c-overlay"
				onClick={hideCallback}
				onKeyDown={escPressHandle}
			></div>
			<div className="c-popup">
				<div className="flex flex-col">
					{props.showTitle ?? true ? (
						<div className="c-popup-title">
							<IconButton className="w-5 h-5 p-2" onClick={hideCallback}>
								<Close />
							</IconButton>
						</div>
					) : (
						<></>
					)}
					<div className="c-popup-content">{children}</div>
				</div>
			</div>
		</>
	);
}
