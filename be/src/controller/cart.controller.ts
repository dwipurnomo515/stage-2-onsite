import { Request, Response } from "express";
import cartService from "../services/cart.service";



class CartController {
    async add(req: Request, res: Response) {
        try {
            const { quantity } = req.body
            const userId = +(req as any).user.id
            const productId = req.params.productId
            if (!quantity || isNaN(quantity) || quantity <= 0) {
                res.status(400).json({ error: "Invalid quantity" });
                return;
            }


            const cartItem = await cartService.createOrUpdateCart(userId, +productId, quantity)

            res.status(201).json(cartItem)
        } catch (error: any) {


            res.status(400).json({ error: error.message })
        }


    }
    async getCart(req: Request, res: Response) {
        try {
            const userId = +(req as any).user.id

            if (isNaN(userId)) {
                res.status(400).json({ error: 'Invalid userId' });
                return;
            }

            const items = await cartService.getCartItems(userId);
            res.json(items);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });

        }
    }

    // async getCart(req: Request, res: Response) {
    //     try {
    //         const userId = (req as any).user.id

    //         if (isNaN(userId)) {
    //             return res.status(400).json({ error: 'Invalid userId' });
    //         }

    //         const items = await cartService.getCartItems(userId);
    //         res.json(items);
    //     } catch (error: any) {
    //         res.status(400).json({ error: error.message });
    //     }

    // }
    async remove(req: Request, res: Response) {
        try {
            const cartItemId = +req.params.cartItemId

            if (isNaN(cartItemId)) {
                res.status(400).json({ error: 'Invalid cartItemId' });
                return
            }

            const removedItem = await cartService.remove(cartItemId);
            res.json({ message: 'Item removed successfully', removedItem });

        } catch (error: any) {
            res.status(400).json({ error: error.message });

        }
    }

    async updateItemQuantity(req: Request, res: Response) {
        try {
            const cartItemId = +req.params.cartItemId
            const { quantity } = req.body

            if (isNaN(cartItemId) || isNaN(quantity)) {
                res.status(400).json({ error: 'Invalid cartItemId or quantity' });
                return;
            }

            const updated = await cartService.updateCartItemQuantitiy(cartItemId, quantity);
            res.json(updated)
        } catch (error: any) {
            res.status(400).json({ error: error.message });

        }
    }
}

export default new CartController;