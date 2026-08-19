import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { X, Send, AlertCircle, Info } from 'lucide-react';

interface InviteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { invitedUserId?: string; email?: string; message?: string; expiresAt?: string }) => Promise<void>;
  isSending?: boolean;
}

export function InviteUserDialog({
  isOpen,
  onClose,
  onSend,
  isSending = false,
}: InviteUserDialogProps) {
  const [inviteTarget, setInviteTarget] = useState('');
  const [message, setMessage] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const target = inviteTarget.trim();

    if (!target) {
      setError('Please enter a User Email or User ID');
      return;
    }

    const isEmail = target.includes('@');
    if (isEmail) {
      if (!emailRegex.test(target)) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      if (!uuidRegex.test(target)) {
        setError('Please enter a valid User ID format (UUID)');
        return;
      }
    }

    try {
      const payload: any = {};
      if (isEmail) {
        payload.email = target;
      } else {
        payload.invitedUserId = target;
      }

      if (message.trim()) {
        payload.message = message.trim();
      }
      if (expiresAt.trim()) {
        payload.expiresAt = new Date(expiresAt).toISOString();
      }

      await onSend(payload);
      // Reset form
      setInviteTarget('');
      setMessage('');
      setExpiresAt('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200/50 dark:border-slate-800/80 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-655 dark:hover:text-slate-300 rounded-full p-1"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-1">
          Invite Player
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Enter the player's Email address or unique User ID to send them an invitation.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 rounded-xl p-3 flex items-start space-x-2 text-xs">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
              Player Email or User ID *
            </label>
            <Input
              type="text"
              required
              disabled={isSending}
              placeholder="e.g. player@example.com or user-uuid"
              value={inviteTarget}
              onChange={(e) => setInviteTarget(e.target.value)}
              className="w-full"
            />
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-405 dark:text-slate-500 mt-1.5">
              <Info className="h-3.5 w-3.5" />
              <span>You can invite users by their email or their unique profile ID.</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              maxLength={300}
              disabled={isSending}
              rows={3}
              placeholder="Hey! Join our sports group for a friendly match."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-202 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
            <div className="text-right text-[10px] text-slate-400 mt-1">
              {message.length}/300
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
              Expiration Date (Optional)
            </label>
            <Input
              type="datetime-local"
              disabled={isSending}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSending}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSending}
              className="flex items-center space-x-1.5 rounded-xl px-5"
            >
              <Send className="h-4 w-4" />
              <span>{isSending ? 'Sending...' : 'Send Invitation'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteUserDialog;
