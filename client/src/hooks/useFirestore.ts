import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '../firebase';

export function useFirestore<T>(collectionName: string, orderByField?: string, direction: 'asc' | 'desc' = 'desc') {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        const collectionRef = collection(db, collectionName);
        
        // Build query constraints
        const constraints: QueryConstraint[] = [];
        if (orderByField) {
            constraints.push(orderBy(orderByField, direction));
        }

        const q = query(collectionRef, ...constraints);

        // Real-time listener
        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const results = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as T[];
                
                setData(results);
                setLoading(false);
                setError(null);
            }, 
            (err) => {
                console.error(`Firestore Error (${collectionName}):`, err);
                setError(err);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [collectionName, orderByField, direction]);

    return { data, loading, error };
}
