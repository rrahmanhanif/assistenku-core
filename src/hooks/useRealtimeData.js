// src/hooks/useRealtimeData.js
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// Hook universal untuk realtime data antar aplikasi
export default function useRealtimeData() {
  const [data, setData] = useState({
    mitra: [],
    customer: [],
    orders: [],
    transactions: [],
  });

  useEffect(() => {
    const unsubMitra = onSnapshot(collection(db, "mitra_activity"), (snapshot) => {
      setData((prev) => ({ ...prev, mitra: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) }));
    });

    const unsubCustomer = onSnapshot(collection(db, "customer_activity"), (snapshot) => {
      setData((prev) => ({ ...prev, customer: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) }));
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      setData((prev) => ({ ...prev, orders: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) }));
    });

    const unsubTransactions = onSnapshot(collection(db, "transactions"), (snapshot) => {
      setData((prev) => ({ ...prev, transactions: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) }));
    });

    return () => {
      unsubMitra();
      unsubCustomer();
      unsubOrders();
      unsubTransactions();
    };
  }, []);

  return data;
              }
