package org.telegram.ai.agent.data.local.db

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import org.telegram.ai.agent.ai.models.ModelProviderConfig
import org.telegram.ai.agent.data.local.db.dao.ModelProviderDao

@Database(
    entities = [ModelProviderConfig::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun modelProviderDao(): ModelProviderDao

    companion object {
        const val DATABASE_NAME = "telai_room.db"
    }
}
