/*
 * ============================================================================
 * app/dashboard/alerts/page.tsx — ALERTS HISTORY
 * Component: Person E (Frontend Developer)
 *
 * History of all SMS alerts sent to the farmer.
 *
 * WHAT NEEDS TO BE DONE (Feature 7.x + 16.x — Alerts & Export):
 * 7.1  SMS History List   — All sent SMS messages
 * 7.2  Delivery Status    — Delivered / Pending / Failed with icons
 * 7.3  Timestamp          — When each SMS was sent
 * 7.4  Recipient Phone    — Show which phone received the SMS
 * 7.5  Search by Farm     — Search field for filtering
 * 7.6  Filter by Date     — Date-range filter
 * 7.7  Filter by Status   — Dropdown for status filter
 * 7.8  Pagination         — Previous/Next navigation
 * 7.9  Export CSV         — Download history as CSV
 * 7.10 Export PDF         — Download history as PDF
 * 7.11 SMS Count          — Total SMS sent
 * 7.12 Delivery Rate      — % of SMS delivered
 *
 * Export extras (Feature 16.x):
 * 16.3 Monthly Report     — Generate monthly summary report
 * 16.4 Share Report       — Share the report (link/WhatsApp/email)
 *
 * Implementation notes:
 * - API: getAlertHistory() (lib/api/client.ts).
 * - CSV export can be built client-side (no extra dep); PDF via library.
 *
 * Feature references: 7.1–7.12, 13.7 (SMS history), 16.1–16.4.
 * ============================================================================
 */

"use client";

import React, { useMemo, useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { formatDate } from "../../../lib/utils/formatDate";
import type { SMSLog, SMSStatus } from "../../../types";

const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
	{ value: "", label: "All statuses" },
	{ value: "delivered", label: "Delivered" },
	{ value: "pending", label: "Pending" },
	{ value: "failed", label: "Failed" },
];

const STATUS_STYLES: Record<SMSStatus, { badge: string; icon: string }> = {
	delivered: { badge: "bg-optimal-bg text-optimal-text", icon: "✓" },
	pending: { badge: "bg-caution-bg text-caution-text", icon: "…" },
	failed: { badge: "bg-dry-bg text-dry-text", icon: "✕" },
};

/** Mock data until getAlertHistory() is wired to the Go API. */
const seedLogs = (): SMSLog[] => {
	const now = Date.now();
	return [
		{
			id: "sms-1",
			farmerId: "demo-farmer",
			farmName: "Field A",
			recipientPhone: "+254712345678",
			message: "IRRIGATE Field A today: soil moisture 24%, apply ~1200L.",
			language: "en",
			status: "delivered",
			createdAt: new Date(now - 2 * 3600_000).toISOString(),
		},
		{
			id: "sms-2",
			farmerId: "demo-farmer",
			farmName: "Field B",
			recipientPhone: "+2547339876543",
			message: "WAIT: 78% chance of rain tomorrow on Field B.",
			language: "en",
			status: "delivered",
			createdAt: new Date(now - 26 * 3600_000).toISOString(),
		},
		{
			id: "sms-3",
			farmerId: "demo-farmer",
			farmName: "Field A",
			recipientPhone: "+254711000111",
			message: "Tank level low on Field A: 410L remaining.",
			language: "sw",
			status: "pending",
			createdAt: new Date(now - 30 * 3600_000).toISOString(),
		},
		{
			id: "sms-4",
			farmerId: "demo-farmer",
			farmName: "Field B",
			recipientPhone: "+254720555444",
			message: "MONITOR Field B: moisture stable at 47%.",
			language: "luo",
			status: "failed",
			createdAt: new Date(now - 52 * 3600_000).toISOString(),
		},
	];
};

export default function AlertsPage() {
	const [logs] = useState<SMSLog[]>(seedLogs); // TODO(Person E): swap for getAlertHistory()
	const [search, setSearch] = useState(""); // 7.5
	const [statusFilter, setStatusFilter] = useState(""); // 7.7
	const [fromDate, setFromDate] = useState(""); // 7.6
	const [toDate, setToDate] = useState(""); // 7.6
	const [page, setPage] = useState(1); // 7.8

	const filtered = useMemo(
		() =>
			logs.filter((log) => {
				if (search && !log.farmName.toLowerCase().includes(search.toLowerCase())) return false;
				if (statusFilter && log.status !== statusFilter) return false;
				if (fromDate && log.createdAt < fromDate) return false;
				if (toDate && log.createdAt > `${toDate}T23:59:59`) return false;
				return true;
			}),
		[logs, search, statusFilter, fromDate, toDate]
	);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const pageLogs = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

	const totalSent = logs.length; // 7.11
	const deliveredCount = logs.filter((l) => l.status === "delivered").length;
	const deliveryRate = totalSent ? Math.round((deliveredCount / totalSent) * 100) : 0; // 7.12

	// 7.9 — client-side CSV export (no extra dependency).
	const exportCsv = () => {
		const header = "Date,Farm,Recipient,Language,Status,Message\n";
		const rows = filtered
			.map((log) =>
				[
					formatDate(log.createdAt),
					log.farmName,
					log.recipientPhone,
					log.language,
					log.status,
					`"${log.message.replace(/"/g, '""')}"`,
				].join(",")
			)
			.join("\n");
		const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `kijanifarmer-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
		link.click();
		URL.revokeObjectURL(url);
	};

	// 7.10 / 16.3 — print-to-PDF via the browser (swap for a PDF lib later).
	const exportPdf = () => window.print();

	// 16.4 — share via Web Share API with mailto fallback.
	const shareReport = async () => {
		const summary = `KijaniFarmer report: ${totalSent} SMS sent, ${deliveryRate}% delivered.`;
		if (navigator.share) {
			try {
				await navigator.share({ title: "KijaniFarmer Alerts Report", text: summary });
				return;
			} catch {
				// user cancelled — fall through
			}
		}
		window.location.href = `mailto:?subject=KijaniFarmer%20Alerts%20Report&body=${encodeURIComponent(summary)}`;
	};

	return (
		<div>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="font-serif text-4xl font-bold">Alerts History</h1>
					<p className="text-secondary mt-2">Every SMS alert we&apos;ve sent you.</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={exportCsv}>
						Export CSV
					</Button>
					<Button variant="outline" size="sm" onClick={exportPdf}>
						Export PDF
					</Button>
					<Button variant="outline" size="sm" onClick={shareReport}>
						Share
					</Button>
				</div>
			</div>

			{/* 7.11 / 7.12 — summary stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
				<div className="rounded-2xl border border-border bg-white p-6">
					<p className="label-mono">Total SMS sent</p>
					<p className="font-serif text-3xl font-bold mt-2">{totalSent}</p>
				</div>
				<div className="rounded-2xl border border-border bg-white p-6">
					<p className="label-mono">Delivery rate</p>
					<p className="font-serif text-3xl font-bold mt-2 text-primary">{deliveryRate}%</p>
				</div>
				<div className="rounded-2xl border border-border bg-white p-6">
					<p className="label-mono">Delivered</p>
					<p className="font-serif text-3xl font-bold mt-2">{deliveredCount}</p>
				</div>
				<div className="rounded-2xl border border-border bg-white p-6">
					<p className="label-mono">Failed</p>
					<p className="font-serif text-3xl font-bold mt-2 text-dry-text">
						{logs.filter((l) => l.status === "failed").length}
					</p>
				</div>
			</div>

			{/* 7.5–7.7 — filters */}
			<div className="rounded-2xl border border-border bg-white p-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
					<Input
						label="Search farm"
						placeholder="e.g. Field A"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
					/>
					<Input
						label="From"
						type="date"
						value={fromDate}
						onChange={(e) => setFromDate(e.target.value)}
					/>
					<Input label="To" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
					<Input
						label="Status"
						type="select"
						options={STATUS_OPTIONS}
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					/>
				</div>

				{/* 7.1–7.4 — history list */}
				<ul className="divide-y divide-border">
					{pageLogs.map((log) => (
						<li key={log.id} className="py-4 flex items-start gap-4">
							<span
								className={`label-mono px-2 py-1 rounded-full shrink-0 ${STATUS_STYLES[log.status].badge}`}
							>
								{STATUS_STYLES[log.status].icon} {log.status}
							</span>
							<div className="flex-1 min-w-0">
								<p className="text-sm">{log.message}</p>
								<p className="text-xs font-mono text-secondary mt-1">
									{log.farmName} → {log.recipientPhone} · {formatDate(log.createdAt)} ·{" "}
									{log.language.toUpperCase()}
								</p>
							</div>
						</li>
					))}
				</ul>

				{filtered.length === 0 && (
					<p className="py-6 text-center text-sm text-secondary">No alerts match these filters.</p>
				)}

				{/* 7.8 — pagination */}
				{totalPages > 1 && (
					<div className="mt-5 flex items-center justify-between">
						<Button
							variant="outline"
							size="sm"
							disabled={safePage <= 1}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
						>
							← Previous
						</Button>
						<span className="text-xs font-mono text-secondary">
							Page {safePage} of {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							disabled={safePage >= totalPages}
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						>
							Next →
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
