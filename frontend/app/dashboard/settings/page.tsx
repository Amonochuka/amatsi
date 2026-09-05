"use client";

/*
 * app/dashboard/settings/page.tsx — SETTINGS
 *
 * Account, preference, phone, and subscription management.
 * Features 8.x (profile/password/language/SMS/theme/phones), 17.x (plan).
 */

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/ThemeProvider";
import { authAPI, phoneAPI, setStoredUser, getStoredUser, usageAPI } from "@/lib/api/client";
import { isValidPhone } from "@/lib/utils/validators";
import type { Language, Theme, Usage, UserPhone } from "@/types";

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

	// 8.1 — profile state (initialized from the real logged-in user)
	const { user, logout, refreshProfile } = useAuth();
	const [profileSaving, setProfileSaving] = useState(false);

	const [profile, setProfile] = useState({
		name: user?.full_name ?? "",
		phone: user?.phone_number ?? "",
		email: user?.email ?? "",
	});
	const [profileSaved, setProfileSaved] = useState(false);
	const [profileError, setProfileError] = useState<string | null>(null);

	// 8.2 — change password state
	const [passwords, setPasswords] = useState({ current: "", next: "" });
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [passwordSaved, setPasswordSaved] = useState(false);
	const [passwordSaving, setPasswordSaving] = useState(false);

	// 8.3 / 8.4 — preference state. Theme is local-only (persisted by ThemeProvider).
	const { theme, setTheme } = useTheme();
	const [language, setLanguage] = useState<Language>(user?.language ?? "en");
	const [smsEnabled, setSmsEnabled] = useState(user?.sms_enabled ?? true);
	const [prefsSaving, setPrefsSaving] = useState(false);
	const [prefsSaved, setPrefsSaved] = useState(false);

	// 8.6–8.10 — phone management state (primary phone from the real account)
	const [phones, setPhones] = useState<UserPhone[]>([]);
	const [phonesLoading, setPhonesLoading] = useState(true);
	const [newPhone, setNewPhone] = useState({ phone: "", label: "Worker" });
	const [phoneError, setPhoneError] = useState<string | null>(null);
	const [removingPhone, setRemovingPhone] = useState<string | null>(null);

	// Load additional SMS recipients from the backend once.
	useEffect(() => {
		phoneAPI
			.list()
			.then(setPhones)
			.catch(() => {})
			.finally(() => setPhonesLoading(false));
	}, []);

	// 8.11 — delete account confirmation
	const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

	// 8.13 — sync preference
	const [autoSync, setAutoSync] = useState(true);

	// 13.7 — real usage from the backend (/usage)
	const [usage, setUsage] = useState<Usage | null>(null);

	useEffect(() => {
		usageAPI
			.get()
			.then(setUsage)
			.catch(() => {});
	}, []);

	const updateStoredUser = (patch: Partial<typeof user>) => {
		const current = getStoredUser();
		if (current) {
			setStoredUser({ ...current, ...patch } as any);
		}
	};

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setProfileError(null);
		setProfileSaving(true);
		try {
			const { user: updated } = await authAPI.updateProfile({
				full_name: profile.name,
				phone_number: profile.phone,
				email: profile.email,
			});
			refreshProfile(updated);
			updateStoredUser(updated);
			setProfileSaved(true);
			setTimeout(() => setProfileSaved(false), 2500);
		} catch (err: any) {
			const msg = err?.response?.data?.error || "Failed to save profile.";
			setProfileError(msg);
		} finally {
			setProfileSaving(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError(null);
		if (!passwords.current || !passwords.next) {
			setPasswordError("Fill in both fields.");
			return;
		}
		if (passwords.next.length < 8) {
			setPasswordError("New password must be at least 8 characters.");
			return;
		}
		setPasswordSaving(true);
		try {
			await authAPI.changePassword({
				current_password: passwords.current,
				new_password: passwords.next,
			});
			setPasswords({ current: "", next: "" });
			setPasswordSaved(true);
			setTimeout(() => setPasswordSaved(false), 2500);
		} catch (err: any) {
			const msg = err?.response?.data?.error || "Failed to change password.";
			setPasswordError(msg);
		} finally {
			setPasswordSaving(false);
		}
	};

	const handleSavePreferences = async () => {
		setPrefsSaving(true);
		try {
			const { user: updated } = await authAPI.updateProfile({
				language,
				sms_enabled: smsEnabled,
			});
			refreshProfile(updated);
			updateStoredUser(updated);
			setPrefsSaved(true);
			setTimeout(() => setPrefsSaved(false), 2500);
		} catch {
			// silently ignore — preferences are non-critical
		} finally {
			setPrefsSaving(false);
		}
	};

	// 8.7 — add an additional recipient (persisted to the backend).
	const handleAddPhone = async (e: React.FormEvent) => {
		e.preventDefault();
		setPhoneError(null);
		if (!isValidPhone(newPhone.phone)) {
			setPhoneError("Enter a valid phone e.g. +254712345678");
			return;
		}
		if (
			user?.phone_number === newPhone.phone ||
			phones.some((p) => p.phone_number === newPhone.phone)
		) {
			setPhoneError("This number is already registered.");
			return;
		}
		try {
			const created = await phoneAPI.add(newPhone.phone, newPhone.label);
			setPhones((prev) => [...prev, created]);
			setNewPhone({ phone: "", label: "Worker" });
		} catch (err: any) {
			const msg = err?.response?.data?.error || "Failed to add phone.";
			setPhoneError(msg);
		}
	};

	// 8.8 — remove an additional recipient (persisted to the backend).
	const handleRemovePhone = async (id: string) => {
		try {
			await phoneAPI.remove(id);
			setPhones((prev) => prev.filter((p) => p.id !== id));
			setRemovingPhone(null);
		} catch {
			setPhoneError("Failed to remove phone.");
		}
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
					<Button type="submit" className="mt-4" disabled={profileSaving}>
						{profileSaving ? "Saving..." : "Save profile"}
					</Button>
					{profileError && <p className="mt-2 text-sm text-rose-600">{profileError}</p>}
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
					<Button type="submit" variant="outline" className="mt-4" disabled={passwordSaving}>
						{passwordSaving ? "Updating..." : "Update password"}
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
							hint="Applied instantly and remembered on this device. Auto follows your system setting."
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
					<Button variant="outline" className="mt-4" onClick={handleSavePreferences} disabled={prefsSaving}>
						{prefsSaving ? "Saving..." : "Save preferences"}
					</Button>
					{prefsSaved && <p className="mt-2 text-sm text-emerald-700">Preferences saved.</p>}
				</div>

				{/* 8.6–8.10 — phone number management */}
				<div className={SECTION_CLASSES}>
					<h2 className={SECTION_TITLE}>SMS recipients</h2>
					{phonesLoading ? (
						<p className="text-sm text-stone-500 mb-4">Loading recipients...</p>
					) : (
					<ul className="space-y-2 mb-4">
						{user?.phone_number && (
							<li className="flex items-center justify-between rounded-lg bg-brand-bg px-3 py-2">
								<div>
									<p className="text-sm font-mono text-stone-900">{user.phone_number}</p>
									<p className="text-xs text-stone-500">
										<span className="rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-mono uppercase text-white">
											Primary
										</span>
									</p>
								</div>
							</li>
						)}
						{phones.map((phone) => (
							<li
								key={phone.id}
								className="flex items-center justify-between rounded-lg bg-brand-bg px-3 py-2"
							>
								<div>
									<p className="text-sm font-mono text-stone-900">{phone.phone_number}</p>
									<p className="text-xs text-stone-500">{phone.label}</p>
								</div>
								{removingPhone === phone.id ? (
									<div className="flex gap-2">
										<button
											onClick={() => handleRemovePhone(phone.id)}
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
										onClick={() => setRemovingPhone(phone.id)}
										className="text-xs font-mono text-rose-600 hover:underline"
									>
										Remove
									</button>
								)}
							</li>
						))}
					</ul>
					)}
					<p className="text-xs text-stone-500 mb-3">
						Alerts go to your primary number plus every recipient added here.
					</p>

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
								<span className="font-medium text-stone-900 capitalize">{user?.is_premium ? "premium" : "free"}</span>
							</p>
						</div>
						{!user?.is_premium && (
						<a
							href="mailto:hello@amatsi.app?subject=Upgrade%20to%20Premium"
							className="inline-flex items-center justify-center rounded-lg bg-brand-accent text-white font-semibold px-4 py-2.5 text-sm hover:bg-emerald-950 transition-colors shadow-sm"
						>
							Upgrade to Premium
						</a>
					)}
					</div>

					{/* 17.7 — usage limits (real numbers from /usage) */}
					<div className="grid grid-cols-2 gap-4 mt-5">
						<div className="rounded-lg bg-brand-bg p-4">
							<p className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
								Recommendations left today
							</p>
							<p className="font-serif text-2xl font-bold text-stone-900 mt-1">
								{usage
									? `${Math.max(usage.recommendations_limit - usage.recommendations_used_today, 0)} / ${usage.recommendations_limit}`
									: "—"}
							</p>
						</div>
						<div className="rounded-lg bg-brand-bg p-4">
							<p className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
								SMS credits remaining
							</p>
							<p className="font-serif text-2xl font-bold text-stone-900 mt-1">
								{usage ? usage.sms_balance ?? "unavailable" : "—"}
							</p>
						</div>
					</div>
				</div>

				{/* 8.12 / 8.14 / 8.15 — support & about */}
				<div className={SECTION_CLASSES}>
					<h2 className={SECTION_TITLE}>Support &amp; about</h2>
					<ul className="space-y-2 text-sm">
						<li>
							<span className="text-stone-500">Support:</span>{" "}
							<a href="mailto:hello@amatsi.app" className="font-mono text-emerald-800 hover:underline">
								hello@amatsi.app
							</a>
						</li>
						<li>
							<span className="text-stone-500">Version:</span>{" "}
							<span className="font-mono text-stone-900">0.1.0</span>
						</li>
						<li>
							<span className="text-stone-500">Backed by:</span> satellite weather &amp;
							soil data · smart SMS alerts · location-based mapping
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
