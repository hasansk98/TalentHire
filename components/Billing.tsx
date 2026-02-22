
import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, Building2, Crown, Receipt, ShieldCheck, Loader2, ArrowUpCircle, Info, Gift, Download, RefreshCw, ToggleLeft, ToggleRight, MapPin, FileText } from 'lucide-react';
import { MOCK_COMPANY, PLANS } from '../constants';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const UsageBar = ({ label, current, max, color }: any) => {
  const percentage = Math.min(100, (current / max) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
        <span>{label}</span>
        <span className="text-slate-900">{current} / {max === Infinity ? '∞' : max}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
};

const PlanCard = ({ name, price, features, current, icon: Icon, color, onUpgrade }: any) => (
  <div className={`p-8 rounded-[2.5rem] border ${current ? `border-indigo-500 ring-4 ring-indigo-500/10` : 'border-slate-200'} bg-white flex flex-col group relative overflow-hidden transition-all hover:shadow-2xl`}>
    {current && (
      <div className="absolute top-0 right-0 bg-indigo-500 text-white px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest">
        Active Tier
      </div>
    )}
    <div className={`w-14 h-14 rounded-2xl ${current ? `bg-indigo-600` : 'bg-slate-100'} flex items-center justify-center mb-6 shadow-xl ${current ? 'shadow-indigo-500/20' : ''}`}>
      <Icon className={current ? 'text-white' : 'text-slate-400'} size={28} />
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-1">{name}</h3>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-4xl font-black text-slate-900 tracking-tighter">{formatINR(price)}</span>
      <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-1">/ Month</span>
    </div>
    <ul className="space-y-4 mb-10 flex-1">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
          <Check size={18} className="text-indigo-500 shrink-0 mt-0.5" />
          {f}
        </li>
      ))}
    </ul>
    <button 
      onClick={() => !current && onUpgrade(name)}
      disabled={current}
      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
        current 
          ? 'bg-slate-50 text-slate-400 cursor-default border border-slate-200' 
          : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-2xl active:scale-95'
      }`}
    >
      {current ? 'Current Plan' : `Provision ${name}`}
    </button>
  </div>
);

const BillingView = () => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(MOCK_COMPANY);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [autoRenew, setAutoRenew] = useState(true);
  const [showGstForm, setShowGstForm] = useState(false);
  const [gstDetails, setGstDetails] = useState({
    gstin: company.gstin || '',
    billing_address: company.billing_address || '',
    state_code: company.state_code || ''
  });
  
  const currentPlan = PLANS.find(p => p.name.toUpperCase().replace(' ', '_') === company.plan) || PLANS[0];

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/v1/billing/invoices', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAutoRenew = async () => {
    try {
      const res = await fetch('/api/v1/billing/toggle-auto-renew', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAutoRenew(data.auto_renew);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string, invoiceNum: string) => {
    try {
      const res = await fetch(`/api/v1/billing/invoice/${invoiceId}/download`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${invoiceNum}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgrade = async (plan: any) => {
    setLoading(true);
    try {
      // 1. Create Order on Backend
      const response = await fetch('/api/v1/billing/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ plan_id: plan.id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create order');
      }

      const orderData = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TalentHire AI",
        description: `Upgrade to ${plan.name}`,
        image: "https://picsum.photos/seed/talenthire/200/200",
        order_id: orderData.order_id,
        handler: async (response: any) => {
          setLoading(true);
          try {
            // 3. Verify Payment on Backend
            const verifyRes = await fetch('/api/v1/billing/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (verifyRes.ok) {
              const newPlan = plan.name.toUpperCase().replace(' ', '_') as any;
              setCompany(prev => ({ ...prev, plan: newPlan }));
              alert(`Success! Your organization is now on the ${plan.name} tier.`);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error(err);
            alert("An error occurred during verification.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Admin User",
          email: "admin@nebula-systems.com",
          contact: "9999999999"
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Financial & Quota Control</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Scale your enterprise talent infrastructure in INR.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all">
            <Receipt size={16} className="text-indigo-600" />
            Export Audit Ledger
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PlanCard 
              name="Free Trial" 
              price={0} 
              features={PLANS[0].features}
              current={company.plan === 'FREE_TRIAL'}
              icon={Gift}
              onUpgrade={() => {}}
            />
            <PlanCard 
              name="Growth" 
              price={15000} 
              features={PLANS[1].features}
              current={company.plan === 'GROWTH'}
              icon={Zap}
              onUpgrade={() => handleUpgrade(PLANS[1])}
            />
            <PlanCard 
              name="Enterprise" 
              price={35000} 
              features={PLANS[2].features}
              current={company.plan === 'ENTERPRISE'}
              icon={Building2}
              onUpgrade={() => handleUpgrade(PLANS[2])}
            />
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <Receipt size={20} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Invoice History</h3>
              </div>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Records</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-4">Invoice #</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoices.length > 0 ? invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 text-xs font-bold text-slate-900">{inv.invoice_number}</td>
                      <td className="px-4 py-4 text-xs text-slate-500">{new Date(inv.issue_date).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-4 text-xs font-black text-slate-900">{formatINR(inv.total_amount)}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-md border border-emerald-100">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button 
                          onClick={() => handleDownloadInvoice(inv.id, inv.invoice_number)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                        >
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-xs font-medium italic">
                        No transaction records found in the ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-slate-200 space-y-8 shadow-2xl shadow-indigo-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Subscription Control</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auto-Renew</p>
                  <p className="text-[11px] font-medium text-slate-400">Automatic cycle billing</p>
                </div>
                <button 
                  onClick={handleToggleAutoRenew}
                  className="text-indigo-600 hover:scale-110 transition-transform"
                >
                  {autoRenew ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-300" />}
                </button>
              </div>

              <UsageBar 
                label="Active Recruitment Pipelines" 
                current={company.jobs_created} 
                max={currentPlan.max_jobs} 
                color="bg-indigo-600" 
              />
              {company.plan === 'FREE_TRIAL' && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Lifetime Limit</p>
                  <p className="text-[11px] font-medium text-amber-700">
                    {company.lifetime_job_used ? '1/1 Lifetime Job Used' : '0/1 Lifetime Job Used'}
                  </p>
                </div>
              )}
              <UsageBar label="Neural Assessment Hours" current={company.plan === 'FREE_TRIAL' ? 0 : 12} max={company.plan === 'FREE_TRIAL' ? 0 : 100} color="bg-violet-600" />
              <UsageBar label="Total Talent Data Entities" current={5} max={currentPlan.max_resumes} color="bg-emerald-500" />
            </div>

            <div className="p-5 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Info size={32} /></div>
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Billing Cycle</p>
               <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                 Next renewal scheduled for <span className="text-white font-bold">March 18, 2026</span>.
               </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">GST Details</h3>
              <FileText size={18} className="text-slate-300" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GSTIN</p>
                <p className="text-xs font-bold text-slate-900">{company.gstin || 'Not Provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Billing Address</p>
                <p className="text-[10px] font-medium text-slate-600 leading-tight">{company.billing_address || 'Not Provided'}</p>
              </div>
              <button 
                onClick={() => setShowGstForm(true)}
                className="w-full py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Update Tax Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center space-y-6 animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/40">
                <Loader2 size={40} className="text-white animate-spin" />
             </div>
             <div>
               <h4 className="text-xl font-black text-slate-900">Synchronizing Ledger</h4>
               <p className="text-sm font-medium text-slate-500 mt-1">Re-provisioning organization infrastructure...</p>
             </div>
          </div>
        </div>
      )}

      <GstDetailsModal 
        isOpen={showGstForm} 
        onClose={() => setShowGstForm(false)} 
        details={gstDetails}
        onSave={(details: any) => {
          setGstDetails(details);
          setCompany(prev => ({ ...prev, ...details }));
          setShowGstForm(false);
        }}
      />
    </div>
  );
};

const GstDetailsModal = ({ isOpen, onClose, details, onSave }: any) => {
  const [form, setForm] = useState(details);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Tax Configuration</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900">✕</button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Company GSTIN</label>
              <input 
                type="text" 
                value={form.gstin}
                onChange={(e) => setForm({...form, gstin: e.target.value})}
                placeholder="27AAACT1234A1Z1"
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500/50 outline-none transition-all font-bold text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Billing Address</label>
              <textarea 
                value={form.billing_address}
                onChange={(e) => setForm({...form, billing_address: e.target.value})}
                placeholder="Full registered address..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500/50 outline-none transition-all font-bold text-sm resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">State Code</label>
              <input 
                type="text" 
                value={form.state_code}
                onChange={(e) => setForm({...form, state_code: e.target.value})}
                placeholder="e.g. 27 for Maharashtra"
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500/50 outline-none transition-all font-bold text-sm"
              />
            </div>
          </div>

          <button 
            onClick={() => onSave(form)}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all"
          >
            Save Tax Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingView;
