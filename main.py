import discord
import os
from discord.flags import Intents
from dotenv import load_dotenv
from time import sleep
import add_audio

load_dotenv()

client = discord.Client()

commands = add_audio.check()


@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))


@client.event
async def on_message(message):
    if message.author == client.user:
        return

    spl = message.content.split(" ")

    for item in spl:
        if item in commands:
            vc = await message.author.voice.channel.connect()
            print('Connected to voice')
            vc.play(discord.FFmpegPCMAudio(
                executable="F:\\FFmpeg\\bin\\ffmpeg.exe", source=commands.get(item)))
            print('playing')
            while vc.is_playing():
                sleep(.1)
            await vc.disconnect()
            print('disconnected')

client.run(os.getenv('TOKEN'))
