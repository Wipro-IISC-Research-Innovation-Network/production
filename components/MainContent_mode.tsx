import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const MainContent = () => {
    const router = useRouter();

    const handleModeSelect = async (mode: 'AUTO' | 'DRIVE' | 'PARKED') => {
        // Map mode to target page
        const pageMap: Record<string, string> = {
            AUTO: '/start',
            DRIVE: '/start1',
            PARKED: '/start2',
        };

        try {
            await fetch('/api/update_mode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode }),
            });
        } catch (err) {
            console.error('Failed to update mode', err);
        }

        router.push(pageMap[mode]);
    };

    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            <main className="main-content">
                <div className="mode-buttons">
                    <div className="mode-button" onClick={() => handleModeSelect('DRIVE')}>
                        <img src="/images_mode/Drive Glow.svg" alt="Drive Icon" />
                    </div>
                    <div className="mode-button" onClick={() => handleModeSelect('PARKED')}>
                        <img src="/images_mode/parked.svg" alt="Parked Icon" />
                    </div>
                    <div className="mode-button" onClick={() => handleModeSelect('AUTO')}>
                        <img src="/images_mode/auto.svg" alt="Auto Icon" />
                    </div>
                </div>
            </main>
        </>
    );
};

export default MainContent;