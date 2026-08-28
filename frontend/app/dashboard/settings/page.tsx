"use client";

/*
 * app/dashboard/settings/page.tsx — SETTINGS
 *
 * Account, preference, phone, and subscription management.
 * Features 8.x (profile/password/language/SMS/theme/phones), 17.x (plan).
 */

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { isValidPhone } from "@/lib/utils/validators";
import type { Language, PhoneLabel, Theme } from "@/types";

const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
	{ value: "en", label: "English" },
	{ value: "sw", label: "Kiswahili" },
	{ value: "luo", label: "Luo" },
];

const THEME_OPTIONS: Array<{ value: Theme; label: string }> = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "auto", label: "Auto" },
];

const SECTION_CLASSES = "rounded-2xl border border-stone-200/60 bg-brand-card p-6";
const SECTION_TITLE = "font-serif text-xl font-bold mb-4 text-stone-900";

export default function SettingsPage() {
	const { user, logout } = useAuth();

	// 8.1 — profile state
	const [profile, setProfile] = useState({
		name: user?.full_name ?? "Demo Farmer",
		phone: user?.phone_number ?? "+254712345678",
		email: user?.email ?? "demo@kijanifarmer.app",
	});
	const [profileSaved, setProfileSaved] = useState(false);

	// 8.2 — change password state
	const [passwords, setPasswords] = useState({ current: "", next: "" });
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [passwordSaved, setPasswordSaved] = useState(false);

	// 8.3 / 8.4 / 8.5 — preference state
	const [language, setLanguage] = useState<Language>("en");
	const [smsEnabled, setSmsEnabled] = useState(true);
	const [theme, setTheme] = useState<Theme>("auto");

	// 8.6–8.10 — phone management state
	const [phones, setPhones] = useState<PhoneLabel[]>([
		{ phone: "+254712345678", label: "Primary", isPrimary: true },
		{ phone: "+254733987654", label: "Worker", isPrimary: false },
	]);
	const [newPhone, setNewPhone] = useState({ phone: "", label: "Worker" });
	const [phoneError, setPhoneError] = useState<string | null>(null);
	const [removingPhone, setRemovingPhone] = useState<string | null>(null);

	// 8.11 — delete account confirmation
	const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

	// 8.13 — sync preference
	const [autoSync, setAutoSync] = useState(true);

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: swap for updateProfile(profile) from lib/api/client.ts
		setProfileSaved(true);
		setTimeout(() => setProfileSaved(false), 2500);
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError(null);
		if (!passwords.current || !passwords.next) {
			setPasswordError("Fill in both fields.");
			return;
		}
		if (passwords.next.length < 6) {
			setPasswordError("New password must be at least 6 characters.");
			return;
		}
		// TODO: swap for changePassword(...) from lib/api/client.ts
		setPasswords({ current: "", next: "" });
		setPasswordSaved(true);
		setTimeout(() => setPasswordSaved(false), 2500);
	};

	// 8.7 — add an additional recipient.
	const handleAddPhone = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isValidPhone(newPhone.phone)) {
			setPhoneError("Enter a valid phone e.g. +254712345678");
			return;
		}
		if (phones.some((p) => p.phone === newPhone.phone)) {
			setPhoneError("This number is already registered.");
			return;
		}
		setPhones((prev) => [...prev, { ...newPhone, isPrimary: false }]);
		setNewPhone({ phone: "", label: "Worker" });
		setPhoneError(null);
	};

	return (
		<div>
			<h1 className="font-serif text-3xl font-bold text-stone-900">Settings</h1>
			<p className="text-stone-500 mt-2 mb-8">Manage your account, alerts and subscription.</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* 8.1 — profile */}
				<form onSubmit={handleSaveProfile} className={SECTION_CLASSES}>
					<h2 className={SECTION_TITLE}>Profile</h2>
					<div className="space-y-4">
						<Input
							label="Full name"
							value={profile.name}
							onChange={(e) => setProfile({ ...profile, name: e.target.value })}
						/>
						<Input
							label="Primary phone"
							type="tel"
							value={profile.phone}
							onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
						/>
						<Input
							label="Email"
							type="email"
							value={profile.email}
							onChange={(e) => setProfile({ ...profile, email: e.target.value })}
						/>
					</div>
					<Button type="submit" className="mt-4">
						Save profile
					</Button>
					{profileSaved && (
						<p className="mt-2 text-sm text-emerald-700">Profile saved.</p>
					)}
				</form>

				{/* 8.2 — change password */}
				<form onSubmit={handleChangePassword} className={SECTION_CLASSES}>
					<h2 className={SECTION_TITLE}>Change password</h2>
					<div className="space-y-4">
						<Input
							label="Current password"
							type="password"
							autoComplete="current-password"
							value={passwords.current}
							onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
						/>
						<Input
							label="New password"
							type="password"
							hint="Minimum 6 characters."
							autoComplete="new-password"
							value={passwords.next}
							onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
						/>
					</div>
					{passwordError && <p className="mt-2 text-sm text-rose-600">{passwordError}</p>}
					{passwordSaved && <p className="mt-2 text-sm text-emerald-700">Password updated.</p>}
					<Button type="submit" variant="outline" className="mt-4">
						Update password
					</Button>
				</form>

				{/* 8.3 / 8.4 / 8.5 — preferences */}
				<div className={SECTION_CLASSES}>
					<h2 className={SECTION_TITLE}>Preferences</h2>
					<div className="space-y-5">
						<Input
							label="Language (UI + SMS)"
							type="select"
							options={LANGUAGE_OPTIONS}
							value={language}
							onChange={(e) => setLanguage(e.target.value as Language)}
						/>

						<div>
							<label className="flex items-center justify-between cursor-pointer">
								<span className="text-sm font-medium text-stone-900">SMS notifications</span>
								<input
									type="checkbox"
									checked={smsEnabled}
									onChange={(e) => setSmsEnabled(e.target.checked)}
									className="h-5 w-5 accent-emerald-700"
								/>
							</label>
							<p className="text-xs text-stone-500 mt-1">
								Get every recommendation by SMS in {LANGUAGE_OPTIONS.find((l) => l.value === language)?.label}.
							</p>
						</div>

						<Input
							label="Theme"
							type="select"
							options={THEME_OPTIONS}
							value={theme}
							onChange={(e) => setTheme(e.target.value as Theme)}
						/>

						{/* 8.13 — offline sync */}
						<label className="flex items-center justify-between cursor-pointer pt-2 border-t border-stone-200">
							<span className="text-sm font-medium text-stone-900">Auto-sync when back online</span>
							<input
								type="checkbox"
								checked={autoSync}
								onChange={(e) => setAutoSync(e.target.checked)}
								className="h-5 w-5 accent-emerald-700"
							/>
						</label>
					</div>
				</div>

				{/* 8.6–8.10 — phone number management */}
				<div className={SECTION_CLASSES}>
					<h2 className={SECTION_TITLE}>SMS recipients</h2>
					<ul className="space-y-2 mb-4">
						{phones.map((phone) => (
							<li
								key={phone.phone}
								className="flex items-center justify-between rounded-lg bg-brand-bg px-3 py-2"
							>
								<div>
									<p className="text-sm font-mono text-stone-900">{phone.phone}</p>
									<p className="text-xs text-stone-500">
										{phone.label}
										{phone.isPrimary && (
											<span className="ml-2 rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-mono uppercase text-white">
												Primary
											</span>
										)}
									</p>
								</div>
								{!phone.isPrimary &&
									(removingPhone === phone.phone ? (
										<div className="flex gap-2">
											<button
												onClick={() =>
													setPhones((prev) => prev.filter((p) => p.phone !== phone.phone))
												}
												className="text-xs font-mono text-rose-600 hover:underline"
											>
												Confirm
											</button>
											<button
												onClick={() => setRemovingPhone(null)}
												className="text-xs font-mono text-stone-500 hover:underline"
											>
												Cancel
											</button>
										</div>
									) : (
										<button
											onClick={() => setRemovingPhone(phone.phone)}
											className="text-xs font-mono text-rose-600 hover:underline"
										>
											Remove
										</button>
									))}
							</li>
						))}
					</ul>

					<form onSubmit={handleAddPhone} className="space-y-3">
						<div className="grid grid-cols-2 gap-3">
							<Input
								label="Phone number"
								type="tel"
								placeholder="+2547..."
								value={newPhone.phone}
								onChange={(e) => setNewPhone({ ...newPhone, phone: e.target.value })}
							/>
							<Input
								label="Label"
								type="select"
								options={[
									{ value: "Worker", label: "Worker" },
									{ value: "Spouse", label: "Spouse" },
									{ value: "Family", label: "Family" },
								]}
							value={newPhone.label}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewPhone({ ...newPhone, label: e.target.value })}
							/>
						</div>
						{phoneError && <p className="text-sm text-rose-600">{phoneError}</p>}
						<Button type="submit" variant="outline" size="sm">
							+ Add phone
						</Button>
					</form>
				</div>

				{/* 17.4 / 17.5 / 17.7 — subscription */}
				<div className={`${SECTION_CLASSES} lg:col-span-2`}>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h2 className={SECTION_TITLE + " !mb-1"}>Subscription</h2>
							<p className="text-sm text-stone-500">
								Current plan:{" "}
								<span className="font-medium text-stone-900 capitalize">free</span>
							</p>
						</div>
						<Button>Upgrade to Premium</Button>
					</div>

					{/* 17.7 — usage limits */}
					<div className="grid grid-cols-2 gap-4 mt-5">
						<div className="rounded-lg bg-brand-bg p-4">
							<p className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
								Recommendations left today
							</p>
							<p className="font-serif text-2xl font-bold text-stone-900 mt-1">3 / 5</p>
						</div>
						<div className="rounded-lg bg-brand-bg p-4">
							<p className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
								SMS credits remaining
							</p>
							<p className="font-serif text-2xl font-bold text-stone-900 mt-1">38</p>
						</div>
					</div>
				</div>

				{/* 8.12 / 8.14 / 8.15 — support & about */}
				<div className={SECTION_CLASSES}>
					<h2 className={SECTION_TITLE}>Support &amp; about</h2>
					<ul className="space-y-2 text-sm">
						<li>
							<span className="text-stone-500">Support:</span>{" "}
							<a href="tel:+254700123456" className="font-mono text-emerald-800 hover:underline">
								+254 700 123 456
							</a>{" "}
							·{" "}
							<a href="mailto:support@kijanifarmer.app" className="font-mono text-emerald-800 hover:underline">
								support@kijanifarmer.app
							</a>
						</li>
						<li>
							<span className="text-stone-500">Version:</span>{" "}
							<span className="font-mono text-stone-900">0.1.0</span>
						</li>
						<li>
							<span className="text-stone-500">Data sources:</span> KijaniBox satellite weather
							&amp; soil · Africa&apos;s Talking SMS · OpenStreetMap
						</li>
					</ul>
				</div>

				{/* 8.11 — danger zone */}
				<div className={`${SECTION_CLASSES} border-rose-300`}>
					<h2 className={`${SECTION_TITLE} !text-rose-600`}>Danger zone</h2>
					<p className="text-sm text-stone-500 mb-4">
						Deleting your account removes your farms, history and stops all SMS alerts. This
						cannot be undone.
					</p>
					{confirmDeleteAccount ? (
						<div className="flex flex-wrap gap-2">
							<Button
								variant="danger"
								size="sm"
								onClick={async () => {
									await logout();
									window.location.href = "/";
								}}
							>
								Yes, delete my account
							</Button>
							<Button variant="ghost" size="sm" onClick={() => setConfirmDeleteAccount(false)}>
								Cancel
							</Button>
						</div>
					) : (
						<Button variant="danger" size="sm" onClick={() => setConfirmDeleteAccount(true)}>
							Delete account
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
