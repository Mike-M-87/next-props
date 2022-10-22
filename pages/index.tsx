import { useEffect } from "react";

export default function Home({}) {
  useEffect(() => window.location.assign("/community/1"), []);
}
