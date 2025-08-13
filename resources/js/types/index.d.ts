import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Service {
    id: number;
    name: string;
    code: string; // Kode singkat, contoh: "A", "B"
    created_at?: string;
    updated_at?: string;
}

export interface Counter {
    id: number;
    name: string;
    service_id: number;
    status: 'open' | 'closed';
    service?: Service; // Relasi opsional
    users?: User[]; // Relasi opsional
    created_at?: string;
    updated_at?: string;
}

export interface Queue {
    id: number;
    service_id: number;
    counter_id?: number;
    queue_number: number; // Nomor urut
    status: 'waiting' | 'serving' | 'done' | 'skipped';
    called_at?: string | null;
    finished_at?: string | null;
    service?: Service; // Relasi opsional
    counter?: Counter;
    created_at?: string;
    updated_at?: string;
}

export interface CounterUser {
    id: number;
    counter_id: number;
    user_id: number;
    counter?: Counter; // Relasi opsional
    user?: User; // Relasi opsional
    created_at?: string;
    updated_at?: string;
}