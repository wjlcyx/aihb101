CREATE TABLE wallpapers (
    id SERIAL PRIMARY KEY,
    img_description TEXT,
    img_size VARCHAR(255),
    img_url TEXT NOT NULL,
    llm_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
