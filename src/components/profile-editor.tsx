"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Save, UserRound } from "lucide-react";

type Profile = {
  name: string;
  email: string;
  college: string | null;
  degree: string | null;
  branch: string | null;
  graduationYear: number | null;
  targetRole: string;
  experienceLevel: string;
  preferredLanguage: string;
  createdAt: string;
};

export function ProfileEditor() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile").then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not load your profile.");
      setProfile(body.profile);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load your profile."))
      .finally(() => setLoading(false));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const graduation = String(form.get("graduationYear") || "");
    const body = {
      name: String(form.get("name") || ""),
      college: String(form.get("college") || "") || null,
      degree: String(form.get("degree") || "") || null,
      branch: String(form.get("branch") || "") || null,
      graduationYear: graduation ? Number(graduation) : null,
      targetRole: String(form.get("targetRole") || ""),
      experienceLevel: String(form.get("experienceLevel") || ""),
      preferredLanguage: String(form.get("preferredLanguage") || ""),
    };
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save your profile.");
      setProfile(result.profile);
      router.refresh();
      setMessage("Your profile and preparation preferences are saved.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return <>
    <header className="page-title">
      <div className="eyebrow">YOUR DETAILS, YOUR DIRECTION</div>
      <h1>Profile & preferences</h1>
      <p>Set the role and skills you’re working toward. Your details stay private to your account.</p>
    </header>
    {loading ? <div className="panel profile-loading" aria-live="polite">Loading your profile…</div> : profile ? <form className="panel profile-form" onSubmit={save}>
      <div className="profile-form-heading"><span><UserRound size={18}/></span><div><h2>Your profile</h2><p>Use these details to shape your preparation.</p></div></div>
      <div className="profile-fields">
        <label>Full name<input name="name" required minLength={2} maxLength={80} defaultValue={profile.name}/></label>
        <label>Email address<input value={profile.email} disabled/><small>Email changes are currently managed by support.</small></label>
        <label>College<input name="college" maxLength={120} defaultValue={profile.college || ""} placeholder="Your college or university"/></label>
        <label>Degree<input name="degree" maxLength={80} defaultValue={profile.degree || ""} placeholder="e.g. B.Tech"/></label>
        <label>Branch<input name="branch" maxLength={100} defaultValue={profile.branch || ""} placeholder="e.g. Computer Science"/></label>
        <label>Graduation year<input name="graduationYear" type="number" min={2020} max={2040} defaultValue={profile.graduationYear || ""} placeholder="2027"/></label>
        <label>Target role<select name="targetRole" defaultValue={profile.targetRole}>{["Software Developer","Java Developer","Python Developer","Full Stack Developer","Data Analyst","Data Scientist","AI/ML Engineer","QA Engineer","Other"].map((option) => <option key={option}>{option}</option>)}</select></label>
        <label>Current level<select name="experienceLevel" defaultValue={profile.experienceLevel}>{["Beginner","Intermediate","Advanced"].map((option) => <option key={option}>{option}</option>)}</select></label>
        <label>Preferred coding language<select name="preferredLanguage" defaultValue={profile.preferredLanguage}>{["Java","Python","C++","JavaScript"].map((option) => <option key={option}>{option}</option>)}</select></label>
      </div>
      {error && <p className="error-banner" role="alert">{error}</p>}
      {message && <p className="profile-success" role="status"><Check size={15}/>{message}</p>}
      <div className="profile-actions"><span>Member since {new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span><button className="button" disabled={saving}>{saving ? "Saving…" : "Save preferences"} {!saving && <Save size={15}/>}</button></div>
    </form> : <div className="error-banner" role="alert">{error}</div>}
  </>;
}
