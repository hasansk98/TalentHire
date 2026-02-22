
import React from 'react';
import { User, Shield, Building, Palette, Lock, Bell, Globe } from 'lucide-react';
import { MOCK_USER, MOCK_COMPANY } from '../constants';

const SettingItem = ({ icon: Icon, title, desc, actionText }: any) => (
  <div className="flex items-center justify-between p-6 hover:bg-slate-50 transition-all rounded-3xl group">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-black text-sm text-slate-900">{title}</h4>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{desc}</p>
      </div>
    </div>
    <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">
      {actionText || 'Configure'}
    </button>
  </div>
);

const SettingsView = () => {
  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage global enterprise preferences and security protocols.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Corporate Identity</h3>
          </div>
          <div className="divide-y divide-slate-100">
            <SettingItem icon={Building} title="Organization Profile" desc={MOCK_COMPANY.name} actionText="Edit Details" />
            <SettingItem icon={Palette} title="Custom Branding" desc="Logo, primary colors, and domain" actionText="Customize" />
            <SettingItem icon={Globe} title="Career Site Settings" desc={`${MOCK_COMPANY.slug}.talenthire.ai`} actionText="Manage Portal" />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Access & Security</h3>
          </div>
          <div className="divide-y divide-slate-100">
            <SettingItem icon={User} title="User Account" desc={MOCK_USER.email} actionText="Profile Settings" />
            <SettingItem icon={Shield} title="RBAC Permissions" desc={`Role: ${MOCK_USER.role}`} actionText="View Permissions" />
            <SettingItem icon={Lock} title="Multi-Factor Auth" desc="Enabled via TOTP" actionText="Manage" />
            <SettingItem icon={Bell} title="Notifications" desc="Email & Desktop alerts" actionText="Configure" />
          </div>
        </div>

        <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center justify-between">
          <div>
            <h4 className="font-black text-sm text-rose-900">Danger Zone</h4>
            <p className="text-xs font-medium text-rose-600">Delete organization and all associated data</p>
          </div>
          <button className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all">
            Terminate Tenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
